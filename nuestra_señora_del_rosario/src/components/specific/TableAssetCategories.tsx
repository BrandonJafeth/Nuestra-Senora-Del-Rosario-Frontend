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
  const { data: categories = [], isLoading } = useAssetCategory();
   const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

    const totalPages = Math.ceil(categories.length / pageSize);

  // Estado para el modal de agregar categoría
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Estado para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<{ idAssetCategory: number; categoryName: string } | null>(null);

  // Estado para el modal de confirmación de edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ idAssetCategory: number; categoryName: string } | null>(null);

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

  // Función para confirmar la edición (modal de confirmación)
  const handleConfirmEdit = () => {
    if (!pendingEdit) return;
    updateEntity.mutate(
      {
        id: pendingEdit.idAssetCategory,
        categoryName: pendingEdit.categoryName,
      },
      {
        onSuccess: () => {
          setIsConfirmEditModalOpen(false);
        },
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
<div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión categoría de los activos</h2>
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
        title="Lista de categorías"
        columns={[{ key: "categoryName", label: "Categoría" }]}
        data={categories || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={openConfirmDeleteModal}
pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
        onPreviousPage={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
        itemsPerPage={pageSize}
      />

      {/* Modal para Agregar Categoría */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar nueva categoría" onClose={closeAddModal}>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nombre de la categoría"
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
        onSave={(updatedValue) => {
          if (editCategory) {
            // Se guarda el cambio pendiente y se abre el modal de confirmación
            setPendingEdit({ idAssetCategory: editCategory.idAssetCategory, categoryName: updatedValue });
            setIsConfirmEditModalOpen(true);
            closeEditModal();
          }
        }}
      />

      {/* Modal de Confirmación para Edición */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message={`¿Seguro que deseas cambiar el nombre de la categoría a ${pendingEdit?.categoryName}?`}
        confirmText="Confirmar"
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
        title="Eliminar categoría"
        message="¿Estás seguro de que quieres eliminar esta categoría?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableAssetCategories;
