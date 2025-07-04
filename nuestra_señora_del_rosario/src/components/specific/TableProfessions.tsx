import React, { useState } from "react";
import { useManagmentProfession } from "../../hooks/useManagmentProfession";
import { useProfession } from "../../hooks/useProfession";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";

const TableProfessions: React.FC = () => {
  const { createEntity, updateEntity, deleteEntity, toast } = useManagmentProfession();
  const { data: professions = [], isLoading } = useProfession();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = Math.ceil(professions.length / pageSize);


  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfession, setNewProfession] = useState({ name_Profession: "" });

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProfession, setEditProfession] = useState<{ id_Profession: number; name_Profession: string } | null>(null);

  // 📌 Estado del modal de confirmación antes de editar
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ id_Profession: number; name_Profession: string } | null>(null);

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [professionToDelete, setProfessionToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Abrir el modal de agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  // 📌 Abrir el modal de edición
  const openEditModal = (item: { id_Profession: number; name_Profession: string }) => {
    setEditProfession({ id_Profession: item.id_Profession, name_Profession: item.name_Profession });
    setIsEditModalOpen(true);
  };

  // 📌 Cerrar el modal de edición
  const closeEditModal = () => {
    setEditProfession(null);
    setIsEditModalOpen(false);
  };

  // 📌 Guardar cambios antes de confirmar la edición
  const handleEditSubmit = (updatedName: string) => {
    if (!editProfession) return;
    setPendingEdit({ id_Profession: editProfession.id_Profession, name_Profession: updatedName });
    setIsConfirmEditModalOpen(true);
    closeEditModal();
  };

  // 📌 Confirmar edición con ID correcto
  const handleEditConfirmed = () => {
    if (pendingEdit) {
      updateEntity.mutate(
        {
          id: pendingEdit.id_Profession,
          name_Profession: pendingEdit.name_Profession,
        },
        { onSuccess: () => setIsConfirmEditModalOpen(false) }
      );
    }
  };

  // 📌 Abrir modal de confirmación para eliminar
  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object") return;
    if (!item.id_Profession) return;
    setProfessionToDelete(item.id_Profession);
    setIsConfirmDeleteModalOpen(true);
  };

  // 📌 Cerrar el modal de confirmación de eliminación
  const closeConfirmDeleteModal = () => {
    setProfessionToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  // 📌 Confirmar eliminación
  const handleDeleteConfirmed = () => {
    if (professionToDelete !== null) {
      setIsDeleting(true);
      deleteEntity.mutate(professionToDelete, {
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

  // 📌 Agregar una nueva profesión
  const handleAddProfession = () => {
    if (newProfession.name_Profession.trim() === "") return;
    createEntity.mutate({ name_Profession: newProfession.name_Profession, id_Profession: 0 });
    setNewProfession({ name_Profession: "" });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestion de profesiones</h2>
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
        title="Lista de profesiones"
        columns={[{ key: "name_Profession", label: "Nombre" }]}
        data={professions || []}
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

      {/* 📌 Modal para Agregar */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar nueva profesión" onClose={closeAddModal}>
        <input
          type="text"
          value={newProfession.name_Profession}
          onChange={(e) => setNewProfession({ ...newProfession, name_Profession: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre de la profesión"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddProfession}>
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
        title="Editar profesión"
        initialValue={editProfession?.name_Profession || ""}
        onClose={closeEditModal}
        onSave={handleEditSubmit}
      />

      {/* 📌 Modal de Confirmación para Edición */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleEditConfirmed}
        title="Confirmar edición"
        message={`¿Seguro que deseas cambiar el nombre a "${pendingEdit?.name_Profession}"?`}
        confirmText="Guardar Cambios"
      />

        <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar profesión"
        message="¿Estás seguro de que quieres eliminar esta profesión?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableProfessions;
