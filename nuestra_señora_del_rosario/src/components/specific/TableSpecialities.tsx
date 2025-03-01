import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import { useManagmentSpecialities } from "../../hooks/useManagmentSpecialities";
import { useSpeciality } from "../../hooks/useSpeciality";

const TableSpecialties: React.FC = () => {
  const {  createSpecialty, deleteSpecialty, toast } = useManagmentSpecialities();
  const {data : specialties, isLoading} = useSpeciality()
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({ name_Specialty: "" });

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewSpecialty({ name_Specialty: "" });
    setIsAddModalOpen(false);
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object") return;
    if (!item.id_Specialty) return;
    setSpecialtyToDelete(item.id_Specialty);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setSpecialtyToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (specialtyToDelete !== null) {
      setIsDeleting(true);
      deleteSpecialty.mutate(specialtyToDelete, {
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

  const handleAddSpecialty = () => {
    if (newSpecialty.name_Specialty.trim() === "") return;
    createSpecialty.mutate({ name_Specialty: newSpecialty.name_Specialty, id_Specialty: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión de Especialidades Médicas</h2>
        <div className="w-28"></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Especialidades Médicas"
        columns={[{ key: "name_Specialty", label: "Nombre" }]}
        data={specialties|| []}
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
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nueva Especialidad" onClose={closeAddModal}>
        <input
          type="text"
          value={newSpecialty.name_Specialty}
          onChange={(e) => setNewSpecialty({ ...newSpecialty, name_Specialty: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre de la especialidad"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddSpecialty}>
            Guardar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Especialidad Médica"
        message="¿Estás seguro de que quieres eliminar esta especialidad médica?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableSpecialties;
