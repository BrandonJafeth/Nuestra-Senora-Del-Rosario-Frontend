import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useManagmentDependencyLevel } from "../../hooks/useManagmentDependencyLevel";
import { useDependencyLevel } from "../../hooks/useDependencyLevel";

const TableDependencyLevels: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentDependencyLevel();
  const { data: dependencyLevels, isLoading } = useDependencyLevel();
  const [pageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDependencyLevel, setNewDependencyLevel] = useState({ levelName: "" });

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDependencyLevel, setEditDependencyLevel] = useState<{ id_DependencyLevel: number; levelName: string }>({
    id_DependencyLevel: 0,
    levelName: "",
  });

  // 📌 Estado del modal de confirmación antes de editar
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEditName, setPendingEditName] = useState<string>("");

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [dependencyLevelToDelete, setDependencyLevelToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Modal para agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewDependencyLevel({ levelName: "" });
    setIsAddModalOpen(false);
  };

  // 📌 Modal para editar solo el nombre
  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_DependencyLevel) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }

    setEditDependencyLevel({ id_DependencyLevel: item.id_DependencyLevel, levelName: item.levelName });
    setPendingEditName(item.levelName); // ✅ Solo se edita el nombre
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // 📌 Confirmación antes de editar
  const handlePreConfirmEdit = (updatedName: string) => {
    setPendingEditName(updatedName);
    setIsConfirmEditModalOpen(true);
  };

  // 📌 Ejecutar edición después de confirmación
  const handleConfirmEdit = () => {
    setIsConfirmEditModalOpen(false);
    
    if (!editDependencyLevel.id_DependencyLevel) {
      console.error("🚨 Error: ID no definido al actualizar el nivel de dependencia.");
      return;
    }

    updateEntity.mutate(
      {
        id: editDependencyLevel.id_DependencyLevel, // ✅ Asegurar que el ID está presente
        levelName: pendingEditName, // ✅ Solo se actualiza el nombre
      },
      {
        onSuccess: () => {
          closeEditModal();
        },
      }
    );
  };

  // 📌 Modal para eliminar
  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_DependencyLevel) return;
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
      deleteEntity.mutate(dependencyLevelToDelete, {
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
    if (newDependencyLevel.levelName.trim() === "") return;
    createEntity.mutate({ levelName: newDependencyLevel.levelName, id_DependencyLevel: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Gestión de niveles de dependencia</h2>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de niveles de dependencia"
        columns={[{ key: "levelName", label: "Nombre" }]}
        data={dependencyLevels || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={openConfirmDeleteModal}     
        pageNumber={pageNumber}
        totalPages={totalPages} onNextPage={function (): void {
          throw new Error("Function not implemented.");
        } } onPreviousPage={function (): void {
          throw new Error("Function not implemented.");
        } }      />

<AdminModalAdd isOpen={isAddModalOpen} title="Agregar nuevo nivel de dependencia" onClose={closeAddModal}>
        <input
          type="text"
          value={newDependencyLevel.levelName}
          onChange={(e) => setNewDependencyLevel({ ...newDependencyLevel, levelName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre del nivel de dependencia"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddDependencyLevel}>
            Guardar
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal para Editar solo el Nombre */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar Nivel de Dependencia"
        onClose={closeEditModal}
        onSave={handlePreConfirmEdit}
        initialValue={pendingEditName}
      />

      {/* 📌 Modal de Confirmación antes de editar */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message={`¿Seguro que deseas cambiar el nombre a "${pendingEditName}"?`}
        confirmText="Confirmar"
        isLoading={false}
      />

      {/* 📌 Modal de Confirmación para eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar nivel de dependencia"
        message="¿Estás seguro de que quieres eliminar este nivel de dependencia?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableDependencyLevels;
