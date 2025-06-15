import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useFundingEntity } from "../../hooks/useFundingEntity";
import { useManagementFundingEntity } from "../../hooks/useManagementFundingEntity";
import { FundingEntityType } from "../../types/FundingEntityType";

const TableFundingEntities: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagementFundingEntity();
  const { data: fundingEntities = [], isLoading } = useFundingEntity();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

    const totalPages = Math.ceil(fundingEntities.length / pageSize);

  // Estado para el modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFundingEntity, setNewFundingEntity] = useState({ name_FundingEntity: "", description_FundingEntity: "" });

  // Estado para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFundingEntity, setEditFundingEntity] = useState<{ id_FundingEntity: number; name_FundingEntity: string; description_FundingEntity: string } | null>(null);

  // Estado para el modal de confirmación de edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ id_FundingEntity: number; name_FundingEntity: string; description_FundingEntity: string } | null>(null);

  // Estado para el modal de confirmación de eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [fundingEntityToDelete, setFundingEntityToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Funciones para abrir y cerrar modales
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewFundingEntity({ name_FundingEntity: "", description_FundingEntity: "" });
    setIsAddModalOpen(false);  };  const openEditModal = (item: unknown) => { // AdminTable passes full item
    if (!item || typeof item !== "object" || !(item as FundingEntityType).id_FundingEntity) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }
    const typedItem = item as FundingEntityType;
    setEditFundingEntity({ 
      id_FundingEntity: typedItem.id_FundingEntity, 
      name_FundingEntity: typedItem.name_FundingEntity,
      description_FundingEntity: typedItem.description_FundingEntity 
    });
    setPendingEdit(typedItem);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleConfirmEdit = () => {
    if (!pendingEdit) return;
    setIsConfirmEditModalOpen(false);
    updateEntity.mutate(
      {
        id: pendingEdit.id_FundingEntity,
        name_FundingEntity: pendingEdit.name_FundingEntity,
        description_FundingEntity: pendingEdit.description_FundingEntity,
      },
      {
        onSuccess: () => closeEditModal(),
      }
    );
  };  const openConfirmDeleteModal = (item: unknown) => { // AdminTable passes full item
    if (!item || typeof item !== "object" || !(item as FundingEntityType).id_FundingEntity) return;
    const typedItem = item as FundingEntityType;
    setFundingEntityToDelete(typedItem.id_FundingEntity);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setFundingEntityToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleAddFundingEntity = () => {
    if (newFundingEntity.name_FundingEntity.trim() === "") return;
    createEntity.mutate({
      name_FundingEntity: newFundingEntity.name_FundingEntity,
      description_FundingEntity: newFundingEntity.description_FundingEntity,
      id_FundingEntity: 0,
    });
    closeAddModal();
  };
  return (
    <div className="p-8">
<div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión entidades financiadoras</h2>
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
        title="Lista de entidades financiadoras"
        columns={[
          { key: "name_FundingEntity", label: "Nombre" },
          { key: "description_FundingEntity", label: "Descripción" }
        ]}
        data={fundingEntities || []}
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

      {/* Modal para Agregar Entidad Financiadora */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar nueva entidad financiadora" onClose={closeAddModal}>
        <input
          type="text"
          value={newFundingEntity.name_FundingEntity}
          onChange={(e) => setNewFundingEntity({ ...newFundingEntity, name_FundingEntity: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nombre de la entidad financiadora"
        />
        <textarea
          value={newFundingEntity.description_FundingEntity}
          onChange={(e) => setNewFundingEntity({ ...newFundingEntity, description_FundingEntity: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 h-24 resize-none"
          placeholder="Descripción de la entidad financiadora"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddFundingEntity}>
            Guardar
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
        </div>
      </AdminModalAdd>

      {/* Modal para Editar Entidad Financiadora */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar entidad financiadora"
        initialValue={editFundingEntity?.name_FundingEntity || ""}
        onClose={closeEditModal}
        onSave={(updatedValue) => {
          if (editFundingEntity) {
            setPendingEdit({ 
              id_FundingEntity: editFundingEntity.id_FundingEntity, 
              name_FundingEntity: updatedValue,
              description_FundingEntity: editFundingEntity.description_FundingEntity 
            });
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
        message={`¿Seguro que deseas cambiar el nombre de la entidad financiadora ${pendingEdit?.name_FundingEntity}?`}
        confirmText="Confirmar"
      />

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={() => {
          if (fundingEntityToDelete !== null) {
            setIsDeleting(true);
            deleteEntity.mutate(fundingEntityToDelete, {
              onSuccess: () => {
                setIsDeleting(false);
                closeConfirmDeleteModal();
              },
              onError: () => setIsDeleting(false),
            });
          }
        }}
        title="Eliminar entidad financiadora"
        message="¿Estás seguro de que quieres eliminar esta entidad financiadora?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableFundingEntities;
