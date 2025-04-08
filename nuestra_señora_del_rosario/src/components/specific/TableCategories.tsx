import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useManagmentCategories } from "../../hooks/useManagmentCategories";
import { useCategories } from "../../hooks/useCategories";

const TableCategories: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentCategories();
  const { data: categories, isLoading } = useCategories();
  const [pageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoryName: "" });

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<{ categoryID: number; categoryName: string } | null>(null);

  // 📌 Estado del modal de confirmación antes de editar
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEditName, setPendingEditName] = useState<string>("");

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Modal para agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewCategory({ categoryName: "" });
    setIsAddModalOpen(false);
  };

  // 📌 Modal para editar solo el nombre
  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || item.categoryID === undefined) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }

    // ✅ Asegurar que se pasa un `categoryID` válido
    setEditCategory({ categoryID: item.categoryID, categoryName: item.categoryName });
    setPendingEditName(item.categoryName);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  // 📌 Confirmación antes de editar
  const handlePreConfirmEdit = (updatedName: string) => {
    setPendingEditName(updatedName);
    setIsConfirmEditModalOpen(true);
  };

  // 📌 Ejecutar edición después de confirmación
  const handleConfirmEdit = () => {
    setIsConfirmEditModalOpen(false);

    // ✅ Verificar si `editCategory` existe y tiene un `categoryID` válido
    if (!editCategory || !editCategory.categoryID) {
      console.error("🚨 Error: ID requerido para la actualización");
      return;
    }

    updateEntity.mutate(
      {
        id: editCategory.categoryID, // ✅ Ahora el ID siempre es válido
        categoryName: pendingEditName,
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
    if (!item || typeof item !== "object" || item.categoryID === undefined) return;
    setCategoryToDelete(item.categoryID);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setCategoryToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (categoryToDelete !== null) {
      setIsDeleting(true);
      deleteEntity.mutate(categoryToDelete, {
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

  const handleAddCategory = () => {
    if (newCategory.categoryName.trim() === "") return;
    createEntity.mutate({ categoryName: newCategory.categoryName, categoryID: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Gestión de Categorías</h2>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Categorías"
        columns={[{ key: "categoryName", label: "Nombre" }]}
        data={categories || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={openConfirmDeleteModal}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => {}}
        onPreviousPage={() => {}}
      />

      {/* 📌 Modal para Agregar */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar nueva categoría" onClose={closeAddModal}>
        <input
          type="text"
          value={newCategory.categoryName}
          onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nombre de la categoría"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddCategory}>
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
        title="Editar categoría"
        onClose={closeEditModal}
        onSave={handlePreConfirmEdit}
        initialValue={pendingEditName}
      />

      {/* 📌 Modal de Confirmación para Edición */}
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
        title="Eliminar categoría"
        message="¿Estás seguro de que quieres eliminar esta categoría?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableCategories;
