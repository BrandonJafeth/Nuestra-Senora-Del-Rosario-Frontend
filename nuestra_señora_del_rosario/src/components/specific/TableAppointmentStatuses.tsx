import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit"; 
import { useAppointmentStatuses } from "../../hooks/useappointmentStatus";
import { useAppointmentStatusMutation } from "../../hooks/useAppoinmentStatusMutation";


const TableAppointmentStatuses: React.FC = () => {
  const { data: appointmentStatuses = [], isLoading } = useAppointmentStatuses();
  const { createEntity, updateEntity, deleteEntity, toast } = useAppointmentStatusMutation();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

    const totalPages = Math.ceil(appointmentStatuses.length / pageSize);


  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAppointmentStatus, setNewAppointmentStatus] = useState({ name_StatusAP: "" });

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAppointmentStatus, setEditAppointmentStatus] = useState<{ id_StatusAP: number; name_StatusAP: string }>({
    id_StatusAP: 0,
    name_StatusAP: "",
  });

  // 📌 Estado del modal de confirmación para edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEditValue, setPendingEditValue] = useState<string>("");

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [appointmentStatusToDelete, setAppointmentStatusToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewAppointmentStatus({ name_StatusAP: "" });
    setIsAddModalOpen(false);
  };

  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object") return;
    setEditAppointmentStatus({ id_StatusAP: item.id_StatusAP, name_StatusAP: item.name_StatusAP });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditAppointmentStatus({ id_StatusAP: 0, name_StatusAP: "" });
    setIsEditModalOpen(false);
  };

  // 📌 Abre el modal de confirmación antes de editar
  const handlePreConfirmEdit = (updatedValue: string) => {
    setPendingEditValue(updatedValue);
    setIsConfirmEditModalOpen(true);
  };

  // 📌 Ejecuta la edición después de la confirmación
  const handleConfirmEdit = () => {
    setIsConfirmEditModalOpen(false);
    updateEntity.mutate(
      { id: editAppointmentStatus.id_StatusAP, name_StatusAP: pendingEditValue },
      {
        onSuccess: () => {
          closeEditModal();
        },
      }
    );
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
      deleteEntity.mutate(appointmentStatusToDelete, {
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
    if (newAppointmentStatus.name_StatusAP.trim() === "") return;
    createEntity.mutate({ name_StatusAP: newAppointmentStatus.name_StatusAP, id_StatusAP: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
<div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión estado de citas médicas</h2>
        <div className="w-28" />
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPageNumber(1);
          }}
          className="p-2 border rounded-lg bg-gray-100"
        >
          {[5, 10, 15, 20].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de estados de citas"
        columns={[{ key: "name_StatusAP", label: "Nombre" }]}
        data={appointmentStatuses || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={(item) => openEditModal(item)}
        onDelete={(item) => openConfirmDeleteModal(item)}
pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
        onPreviousPage={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
        itemsPerPage={pageSize}
      />

      {/* 📌 Modal para Agregar */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar estado de cita" onClose={closeAddModal}>
        <input
          type="text"
          value={newAppointmentStatus.name_StatusAP}
          onChange={(e) => setNewAppointmentStatus({ ...newAppointmentStatus, name_StatusAP: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre del estado de cita"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddAppointmentStatus}>
            Guardar
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal para Editar */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar estado de cita"
        onClose={closeEditModal}
        onSave={handlePreConfirmEdit} // ✅ Muestra el modal de confirmación antes de editar
        initialValue={editAppointmentStatus.name_StatusAP}
      />

      {/* 📌 Modal de Confirmación antes de editar */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message={`¿Seguro que deseas editar el estado de cita a "${pendingEditValue}"?`}
        confirmText="Confirmar"
        isLoading={false}
      />

      {/* 📌 Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar estado de cita"
        message="¿Estás seguro de que quieres eliminar este estado de cita?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableAppointmentStatuses;
