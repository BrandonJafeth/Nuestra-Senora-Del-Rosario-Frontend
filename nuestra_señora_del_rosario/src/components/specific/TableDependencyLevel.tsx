import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import { useManagmentDependencyLevel } from "../../hooks/useManagmentDependencyLevel";
import { useDependencyLevel } from "../../hooks/useDependencyLevel";

const TableDependencyLevels: React.FC = () => {
  const {  createDependencyLevel, deleteDependencyLevel, toast } = useManagmentDependencyLevel();
  const { data: dependencyLevels, isLoading } = useDependencyLevel();
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDependencyLevel, setNewDependencyLevel] = useState({ name: "" });

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [dependencyLevelToDelete, setDependencyLevelToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewDependencyLevel({ name: "" });
    setIsAddModalOpen(false);
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object") return;
    if (!item.id_DependencyLevel) return;
    setDependencyLevelToDelete(item.id_DependencyLevel);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setDependencyLevelToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (dependencyLevelToDelete !== null) {
      setIsDeleting(true);
      deleteDependencyLevel.mutate(dependencyLevelToDelete, {
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

  const handleAddDependencyLevel = () => {
    if (newDependencyLevel.name.trim() === "") return;
    createDependencyLevel.mutate({ levelName: newDependencyLevel.name, id_DependencyLevel: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión de Niveles de Dependencia</h2>
        <div className="w-28"></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Niveles de Dependencia"
        columns={[{ key: "levelName", label: "Nombre" }]}
        data={dependencyLevels || []}
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
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nuevo Nivel de Dependencia" onClose={closeAddModal}>
        <input
          type="text"
          value={newDependencyLevel.name}
          onChange={(e) => setNewDependencyLevel({ ...newDependencyLevel, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre del nivel de dependencia"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddDependencyLevel}>
            Guardar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Nivel de Dependencia"
        message="¿Estás seguro de que quieres eliminar este nivel de dependencia?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableDependencyLevels;
