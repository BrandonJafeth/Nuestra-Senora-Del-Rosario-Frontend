import React, { useState } from "react"; 
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import { useManagmentHealtcareCenter } from "../../hooks/useManagmentHealtcareCenter";
import { useHealthcareCenters } from "../../hooks/useHealthcareCenters";

const TableHealthcareCenter: React.FC = () => {
  const { createHealthcareCenter, deleteHealthcareCenter, toast } = useManagmentHealtcareCenter();
  const { data: healthcareCenters, isLoading } = useHealthcareCenters();
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHealthcareCenter, setNewHealthcareCenter] = useState({
    name_HC: "",
    location_HC: "",
    type_HC: "Público", // Valor por defecto
  });

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [healthcareCenterToDelete, setHealthcareCenterToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewHealthcareCenter({ name_HC: "", location_HC: "", type_HC: "Público" });
    setIsAddModalOpen(false);
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object") return;
    if (!item.id_HC) return;
    setHealthcareCenterToDelete(item.id_HC);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setHealthcareCenterToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (healthcareCenterToDelete !== null) {
      setIsDeleting(true);
      deleteHealthcareCenter.mutate(healthcareCenterToDelete, {
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

  const handleAddHealthcareCenter = () => {
    if (
      newHealthcareCenter.name_HC.trim() === "" ||
      newHealthcareCenter.location_HC.trim() === ""
    )
      return;
    createHealthcareCenter.mutate({
      name_HC: newHealthcareCenter.name_HC,
      location_HC: newHealthcareCenter.location_HC,
      type_HC: newHealthcareCenter.type_HC,
      id_HC: 0,
    });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión de Centros de Atención</h2>
        <div className="w-28"></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Centros de Atención"
        columns={[
          { key: "name_HC", label: "Nombre" },
          { key: "location_HC", label: "Ubicación" },
          { key: "type_HC", label: "Tipo" },
        ]}
        data={healthcareCenters?.data || []}
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
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nuevo Centro de Atención" onClose={closeAddModal}>
        <input
          type="text"
          value={newHealthcareCenter.name_HC}
          onChange={(e) => setNewHealthcareCenter({ ...newHealthcareCenter, name_HC: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre del centro"
        />
        <input
          type="text"
          value={newHealthcareCenter.location_HC}
          onChange={(e) => setNewHealthcareCenter({ ...newHealthcareCenter, location_HC: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese la ubicación"
        />

        {/* 📌 Dropdown para Tipo de Centro de Atención */}
        <select
          value={newHealthcareCenter.type_HC}
          onChange={(e) => setNewHealthcareCenter({ ...newHealthcareCenter, type_HC: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        >
          <option value="Público">Público</option>
          <option value="Privado">Privado</option>
        </select>

        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddHealthcareCenter}>
            Guardar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Centro de Atención"
        message="¿Estás seguro de que quieres eliminar este centro de atención?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableHealthcareCenter;