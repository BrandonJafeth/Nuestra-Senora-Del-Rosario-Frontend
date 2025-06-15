import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useManagmentUnitOfMeasure } from "../../hooks/useManagmentUnitOfMeasure";
import { useUnitOfMeasure } from "../../hooks/useUnitOfMeasure";

const TableUnitOfMeasure: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentUnitOfMeasure();
  const { data: unitOfMeasure = [], isLoading } = useUnitOfMeasure();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(unitOfMeasure.length / pageSize);
  // Modal Agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUnitOfMeasure, setNewUnitOfMeasure] = useState("");

  // Modal Editar
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUnitOfMeasure, setEditUnitOfMeasure] = useState({ unitOfMeasureID: 0, unitName: "" });

  // Modal Confirmación edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEditValue, setPendingEditValue] = useState("");

  // Modal Confirmación eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewUnitOfMeasure("");
    setIsAddModalOpen(false);
  };

  const openEditModal = (item: any) => {
    if (!item || !item.unitOfMeasureID) return;
    setEditUnitOfMeasure({ unitOfMeasureID: item.unitOfMeasureID, unitName: item.nombreUnidad });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditUnitOfMeasure({ unitOfMeasureID: 0, unitName: "" });
    setIsEditModalOpen(false);
  };

  const handlePreConfirmEdit = (updatedValue: string) => {
    setPendingEditValue(updatedValue);
    setIsConfirmEditModalOpen(true);
  };

  const handleConfirmEdit = () => {
    updateEntity.mutate(
      { id: editUnitOfMeasure.unitOfMeasureID, nombreUnidad: pendingEditValue },
      { onSuccess: closeEditModal }
    );
    setIsConfirmEditModalOpen(false);
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item?.unitOfMeasureID) return;
    setUnitToDelete(item.unitOfMeasureID);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setUnitToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (unitToDelete === null) return;
    setIsDeleting(true);
    deleteEntity.mutate(unitToDelete, {
      onSuccess: () => {
        closeConfirmDeleteModal();
        setIsDeleting(false);
      },
      onError: () => setIsDeleting(false),
    });
  };

  const handleAddUnitOfMeasure = () => {
    if (newUnitOfMeasure.trim() === "") return;
    createEntity.mutate({ nombreUnidad: newUnitOfMeasure, unitOfMeasureID: 0 });
    closeAddModal();
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
        title="Lista de unidades de medida"
        columns={[{ key: "nombreUnidad", label: "Nombre" }]}
        data={unitOfMeasure}
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

      {/* Modales */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar unidad de medida" onClose={closeAddModal}>
        <input
          type="text"
          value={newUnitOfMeasure}
          onChange={(e) => setNewUnitOfMeasure(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre de la unidad de medida"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddUnitOfMeasure}>
            Guardar
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
        </div>
      </AdminModalAdd>

      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar Unidad de Medida"
        onClose={closeEditModal}
        onSave={handlePreConfirmEdit}
        initialValue={editUnitOfMeasure.unitName}
      />

      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message={`¿Seguro que deseas editar la unidad de medida a "${pendingEditValue}"?`}
        confirmText="Confirmar"
        isLoading={false}
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar unidad de medida"
        message="¿Estás seguro de que quieres eliminar esta unidad de medida?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableUnitOfMeasure;
