import React, { useState } from "react";
import { useTypeSalary } from "../../hooks/useTypeSalary";
import { useManagmentTypeSalary } from "../../hooks/useManagmentTypeSalary";
import AdminTable from "../microcomponents/AdminTable";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";

const TableTypeOfSalary: React.FC = () => {
  const { createEntity, updateEntity, deleteEntity, toast } = useManagmentTypeSalary();
  const { data: typeSalary = [], isLoading } = useTypeSalary();

    const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
    const totalPages = Math.ceil(typeSalary.length / pageSize);

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSalaryType, setNewSalaryType] = useState("");

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSalaryType, setEditSalaryType] = useState<{ id_TypeOfSalary: number; name_TypeOfSalary: string } | null>(null);

  // 📌 Estado del modal de confirmación antes de editar
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ id_TypeOfSalary: number; name_TypeOfSalary: string } | null>(null);

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Abrir el modal de agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  // 📌 Abrir el modal de edición
  const openEditModal = (item: { id_TypeOfSalary: number; name_TypeOfSalary: string }) => {
    setEditSalaryType({ id_TypeOfSalary: item.id_TypeOfSalary, name_TypeOfSalary: item.name_TypeOfSalary });
    setIsEditModalOpen(true);
  };

  // 📌 Cerrar el modal de edición
  const closeEditModal = () => {
    setEditSalaryType(null);
    setIsEditModalOpen(false);
  };

  // 📌 Guardar cambios antes de confirmar la edición
  const handleEditSubmit = (updatedName: string) => {
    if (!editSalaryType) return;
    setPendingEdit({ id_TypeOfSalary: editSalaryType.id_TypeOfSalary, name_TypeOfSalary: updatedName });
    setIsConfirmEditModalOpen(true);
    closeEditModal();
  };

  // 📌 Confirmar edición con ID correcto
  const handleEditConfirmed = () => {
    if (pendingEdit) {
      updateEntity.mutate(
        {
          id: pendingEdit.id_TypeOfSalary,
          name_TypeOfSalary: pendingEdit.name_TypeOfSalary,
        },
        { onSuccess: () => setIsConfirmEditModalOpen(false) }
      );
    }
  };

  // 📌 Abrir modal de confirmación para eliminar
  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object") {
      return;
    }
    if (!item.id_TypeOfSalary) {
      return;
    }
    setSalaryToDelete(item.id_TypeOfSalary);
    setIsConfirmDeleteModalOpen(true);
  };
  
  // 📌 Cerrar el modal de confirmación de eliminación
  const closeConfirmDeleteModal = () => {
    setSalaryToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  // 📌 Confirmar eliminación
  const handleDeleteConfirmed = () => {
    if (salaryToDelete !== null) {
      setIsDeleting(true);
      deleteEntity.mutate(salaryToDelete, {
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

  // 📌 Agregar un nuevo tipo de salario
  const handleAddTypeSalary = () => {
    if (newSalaryType.trim() === "") return;
    createEntity.mutate({ name_TypeOfSalary: newSalaryType, id_TypeOfSalary: 0 });
    setNewSalaryType("");
    closeAddModal();
  };

  return (
    <div className="p-8">
<div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión tipo de salario</h2>
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
      </div>{toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de tipos de salario"
        columns={[{ key: "name_TypeOfSalary", label: "Nombre" }]}
        data={typeSalary || []}
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

<AdminModalAdd isOpen={isAddModalOpen} title="Agregar nuevo tipo de salario" onClose={closeAddModal}>
        <input
          type="text"
          value={newSalaryType}
          onChange={(e) => setNewSalaryType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre del tipo de salario"
        />
        <div className="flex justify-center space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 " onClick={handleAddTypeSalary}>
          Guardar
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 " onClick={closeAddModal}>
          Cancelar
        </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal para Editar */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar tipo de salario"
        initialValue={editSalaryType?.name_TypeOfSalary || ""}
        onClose={closeEditModal}
        onSave={handleEditSubmit}
      />

      {/* 📌 Modal de Confirmación para Edición */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleEditConfirmed}
        title="Confirmar edición"
        message={`¿Seguro que deseas cambiar el nombre a "${pendingEdit?.name_TypeOfSalary}"?`}
        confirmText="Guardar cambios"
      />

      {/* 📌 Modal de Confirmación para Eliminar */<ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar tipo de salario"
        message="¿Estás seguro de que quieres eliminar este Tipo de Salario?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />}
    </div>
  );
};

export default TableTypeOfSalary;
