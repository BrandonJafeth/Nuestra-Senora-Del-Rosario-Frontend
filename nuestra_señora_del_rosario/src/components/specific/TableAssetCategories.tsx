import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useManagmentAssetCategory } from "../../hooks/useManagmentAssetCategory";
import { useAssetCategory } from "../../hooks/useAssetCategory";

const TableAssetCategories: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentAssetCategory();
  const { data: categories, isLoading } = useAssetCategory();
  const [pageNumber] = useState(1);
  const totalPages = 1; 

  // Estado para el modal de agregar categoría
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Estado para el modal de edición (solo nombre)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<{ idAssetCategory: number; categoryName: string } | null>(null);

  // Estado para el modal de confirmación de eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Funciones para abrir y cerrar modales
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewCategoryName("");
    setIsAddModalOpen(false);
  };

  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.idAssetCategory) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }
    setEditCategory({ idAssetCategory: item.idAssetCategory, categoryName: item.categoryName });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return;
    createEntity.mutate({
      categoryName: newCategoryName,
      idAssetCategory: 0, // Se asigna 0 para indicar que es un nuevo registro
    });
    closeAddModal();
  };

  const handleEditCategory = (updatedValue: string) => {
    if (!editCategory) return;
    updateEntity.mutate(
      {
        id: editCategory.idAssetCategory,
        categoryName: updatedValue,
      },
      {
        onSuccess: () => closeEditModal(),
      }
    );
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.idAssetCategory) return;
    setCategoryToDelete(item.idAssetCategory);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setCategoryToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Gestión de Categorías de Activos
      </h2>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Categorías"
        columns={[{ key: "categoryName", label: "Categoría" }]}
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

      {/* Modal para Agregar Categoría */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nueva Categoría" onClose={closeAddModal}>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nombre de la Categoría"
        />
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleAddCategory}
          >
            Guardar
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={closeAddModal}
          >
            Cancelar
          </button>
        </div>
      </AdminModalAdd>

      {/* Modal para Editar Categoría */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar Categoría"
        initialValue={editCategory?.categoryName || ""}
        onClose={closeEditModal}
        onSave={(updatedValue) => handleEditCategory(updatedValue)}
      />

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={() => {
          if (categoryToDelete !== null) {
            setIsDeleting(true);
            deleteEntity.mutate(categoryToDelete, {
              onSuccess: () => {
                setIsDeleting(false);
                closeConfirmDeleteModal();
              },
              onError: () => setIsDeleting(false),
            });
          }
        }}
        title="Eliminar Categoría"
        message="¿Estás seguro de que quieres eliminar esta categoría?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableAssetCategories;
