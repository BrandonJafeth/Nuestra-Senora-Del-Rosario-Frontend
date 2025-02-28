import React, { useState } from "react";
import { useTypeSalary } from "../../hooks/useTypeSalary";
import { useManagmentTypeSalary } from "../../hooks/useManagmentTypeSalary";
import AdminTable from "../microcomponents/AdminTable";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";

const TableTypeOfSalary: React.FC = () => {
  const { createTypeSalary, updateTypeSalary, deleteTypeSalary, toast } = useManagmentTypeSalary();
  const { data: typeSalary, isLoading } = useTypeSalary();

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSalaryType, setNewSalaryType] = useState("");

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedSalary, setEditedSalary] = useState<{ id: number; name: string } | null>(null);

  // 📌 Estado del modal de confirmación para edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ id: number; name: string } | null>(null);

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Abrir el modal de agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  // 📌 Abrir el modal de edición
  const openEditModal = (item: { id_TypeOfSalary: number; name_TypeOfSalary: string }) => {
    setEditedSalary({ id: item.id_TypeOfSalary, name: item.name_TypeOfSalary });
    setIsEditModalOpen(true);
  };

  // 📌 Cerrar el modal de edición
  const closeEditModal = () => {
    setEditedSalary(null);
    setIsEditModalOpen(false);
  };

  // 📌 Guardar cambios antes de confirmar la edición
  const handleEditSubmit = (updatedName: string) => {
    if (!editedSalary) return;
    setPendingEdit({ id: editedSalary.id, name: updatedName });
    setIsConfirmEditModalOpen(true);
    closeEditModal();
  };

  // 📌 Confirmar edición con datos correctos
  const handleEditConfirmed = () => {
    if (pendingEdit) {
      updateTypeSalary.mutate(
        { id: pendingEdit.id, data: { name_TypeOfSalary: pendingEdit.name } },
        { onSuccess: () => setIsConfirmEditModalOpen(false) }
      );
    }
  };

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
      deleteTypeSalary.mutate(salaryToDelete, {
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
    createTypeSalary.mutate({
      name_TypeOfSalary: newSalaryType,
      id_TypeOfSalary: 0,
    });
    setNewSalaryType("");
    closeAddModal();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Tipos de Salario</h2>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Tipos de Salario"
        columns={[
          { key: "name_TypeOfSalary", label: "Nombre" },
        ]}
        data={typeSalary || []} // ⚠️ Aquí revisa que `typeSalary` tenga id_TypeOfSalary
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={(item) => openEditModal(item)}
        onDelete={(item) => openConfirmDeleteModal(item)}
        isDarkMode={false} pageNumber={0} onNextPage={function (): void {
          throw new Error("Function not implemented.");
        } } onPreviousPage={function (): void {
          throw new Error("Function not implemented.");
        } }/>


      {/* 📌 Modal para Agregar */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nuevo Tipo de Salario" onClose={closeAddModal}>
        <input
          type="text"
          value={newSalaryType}
          onChange={(e) => setNewSalaryType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre del tipo de salario"
        />
        <div className="flex justify-center space-x-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 " onClick={closeAddModal}>
          Cancelar
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 " onClick={handleAddTypeSalary}>
          Guardar
        </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal para Editar */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar Tipo de Salario"
        initialValue={editedSalary?.name || ""}
        onClose={closeEditModal}
        onSave={handleEditSubmit} // 📌 Guarda antes de confirmar
      />

      {/* 📌 Modal de Confirmación para Edición */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleEditConfirmed}
        title="Confirmar Edición"
        message={`¿Estás seguro de que quieres cambiar el nombre a "${pendingEdit?.name}"?`}
        confirmText="Guardar Cambios"
      />

      {/* 📌 Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Tipo de Salario"
        message="¿Estás seguro de que quieres eliminar este Tipo de Salario?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableTypeOfSalary;
