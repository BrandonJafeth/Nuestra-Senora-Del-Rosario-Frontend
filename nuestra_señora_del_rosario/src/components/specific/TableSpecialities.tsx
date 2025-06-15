import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useManagmentSpecialities } from "../../hooks/useManagmentSpecialities";
import { useSpeciality } from "../../hooks/useSpeciality";

const TableSpecialties: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentSpecialities();
  const { data: specialties = [], isLoading } = useSpeciality();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

    const totalPages = Math.ceil(specialties.length / pageSize);


  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSpecialty, setEditSpecialty] = useState<{ id_Specialty: number; name_Specialty: string }>({
    id_Specialty: 0,
    name_Specialty: "",
  });

  // 📌 Estado del modal de confirmación para edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEditValue, setPendingEditValue] = useState<string>("");

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Modal para agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewSpecialty("");
    setIsAddModalOpen(false);
  };

  // 📌 Modal para editar (corregido)
  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_Specialty) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }

    console.log("🛠️ Editando:", item);
    setEditSpecialty({ id_Specialty: item.id_Specialty, name_Specialty: item.name_Specialty });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditSpecialty({ id_Specialty: 0, name_Specialty: "" });
    setIsEditModalOpen(false);
  };

  // 📌 Abre el modal de confirmación antes de editar
  const handlePreConfirmEdit = (updatedValue: string) => {
    setPendingEditValue(updatedValue);
    setIsConfirmEditModalOpen(true);
  };

  // 📌 Ejecuta la edición después de la confirmación
  const handleConfirmEdit = () => {
    setIsConfirmEditModalOpen(false);
    updateEntity.mutate(
      { id: editSpecialty.id_Specialty, name_Specialty: pendingEditValue },
      {
        onSuccess: () => {
          closeEditModal();
        },
      }
    );
  };

  // 📌 Modal para eliminar
  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_Specialty) return;
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
      deleteEntity.mutate(specialtyToDelete, {
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
    if (newSpecialty.trim() === "") return;
    createEntity.mutate({ name_Specialty: newSpecialty, id_Specialty: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
<div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión especialidades médicas</h2>
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
        title="Lista de especialidades médicas"
        columns={[{ key: "name_Specialty", label: "Nombre" }]}
        data={specialties || []}
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
     <AdminModalAdd isOpen={isAddModalOpen} title="Agregar nueva especialidad" onClose={closeAddModal}>
        <input
          type="text"
          value={newSpecialty}
          onChange={(e) => setNewSpecialty(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre de la especialidad"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 " onClick={handleAddSpecialty}>
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
        title="Editar especialidad médica"
        onClose={closeEditModal}
        onSave={handlePreConfirmEdit}
        initialValue={editSpecialty.name_Specialty}
      />

      {/* 📌 Modal de Confirmación antes de editar */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message={`¿Seguro que deseas editar la especialidad médica a "${pendingEditValue}"?`}
        confirmText="Confirmar"
        isLoading={false}
      />

       {/* 📌 Modal de Confirmación para Eliminar */}
       <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar especialidad"
        message="¿Estás seguro de que quieres eliminar esta Especialidad?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableSpecialties;
