import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useManagmentCategories } from "../../hooks/useManagmentCategories";
import { useCategories } from "../../hooks/useCategories";
import FormField from "../common/FormField";

const TableCategories: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentCategories();
  const { data: categories = [], isLoading } = useCategories();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

    const totalPages = Math.ceil(categories.length / pageSize);

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoryName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const openAddModal = () => setIsAddModalOpen(true);  const closeAddModal = () => {
    setNewCategory({ categoryName: "" });
    setErrors({});
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
  };  const handleAddCategory = () => {
    if (!validateAddForm()) return;
    
    setIsSubmitting(true);
    createEntity.mutate(
      { categoryName: newCategory.categoryName, categoryID: 0 },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          closeAddModal();
        },
        onError: (error: any) => {
          setIsSubmitting(false);
          // Si el backend devuelve errores específicos
          if (error.response?.data?.message) {
            setErrors({ categoryName: error.response.data.message });
          } else {
            setErrors({ categoryName: "Error al crear la categoría" });
          }
        }
      }
    );
  };

  // Función para validar el formulario
  const validateAddForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!newCategory.categoryName.trim()) {
      newErrors.categoryName = 'El nombre de la categoría es obligatorio';
    } else if (newCategory.categoryName.length < 2) {
      newErrors.categoryName = 'El nombre debe tener al menos 2 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="p-8">
 <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Unidades de medida</h2>
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
        title="Lista de Categorías"
        columns={[{ key: "categoryName", label: "Nombre" }]}
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
      
       {/* 📌 Modal para Agregar */}
      <AdminModalAdd 
        isOpen={isAddModalOpen} 
        title="Agregar nueva categoría" 
        onClose={closeAddModal}
        errors={errors}
        width="w-[400px]"
      >
        <FormField
          label="Nombre de la categoría"
          name="categoryName"
          value={newCategory.categoryName}
          onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
          error={errors.categoryName}
          required
          placeholder="Nombre de la categoría"
        />
        <div className="flex justify-center space-x-4 mt-4">
          <button 
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300`}
            onClick={handleAddCategory}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : "Guardar"}
          </button>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" 
            onClick={closeAddModal}
            disabled={isSubmitting}
          >
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
