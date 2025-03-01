import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import { useAppointmentStatuses } from "../../hooks/useappointmentStatus";
import { useManagmentAppointmentStatus } from "../../hooks/useManagmentAppointmentStatus";

const TableAppointmentStatuses: React.FC = () => {
  const { data : appointmentStatuses, isLoading } = useAppointmentStatuses();
  const {createAppointmentStatus, deleteAppointmentStatus, toast} = useManagmentAppointmentStatus();
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAppointmentStatus, setNewAppointmentStatus] = useState({ name: "" });

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [appointmentStatusToDelete, setAppointmentStatusToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewAppointmentStatus({ name: "" });
    setIsAddModalOpen(false);
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object") return;
    if (!item.id_StatusAP) return;
    setAppointmentStatusToDelete(item.id_StatusAP);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setAppointmentStatusToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (appointmentStatusToDelete !== null) {
      setIsDeleting(true);
      deleteAppointmentStatus.mutate(appointmentStatusToDelete, {
        onSuccess: () => {
          setIsDeleting(false);
          closeConfirmDeleteModal();
        },
        onError: () => {
          setIsDeleting(false);
        },
      });
    }
  };
  
  const handleAddAppointmentStatus = () => {
    if (newAppointmentStatus.name.trim() === "") return;
    createAppointmentStatus.mutate({ name_StatusAP: newAppointmentStatus.name, id_StatusAP: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión de Estados de Citas</h2>
        <div className="w-28"></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Estados de Citas"
        columns={[{ key: "name_StatusAP", label: "Nombre" }]}
        data={appointmentStatuses?.data || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={(item) => console.log("Editar:", item)}
        onDelete={(item) => openConfirmDeleteModal(item)}
        isDarkMode={false}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev))}
        onPreviousPage={() => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev))}
      />

      {/* 📌 Modal para Agregar */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nuevo Estado de Cita" onClose={closeAddModal}>
        <input
          type="text"
          value={newAppointmentStatus.name}
          onChange={(e) => setNewAppointmentStatus({ ...newAppointmentStatus, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre del estado de cita"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddAppointmentStatus}>
            Guardar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Estado de Cita"
        message="¿Estás seguro de que quieres eliminar este estado de cita?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableAppointmentStatuses;
