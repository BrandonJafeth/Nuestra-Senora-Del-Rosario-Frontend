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
  const { data: unitOfMeasure, isLoading } = useUnitOfMeasure();
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUnitOfMeasure, setNewUnitOfMeasure] = useState("");

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUnitOfMeasure, setEditUnitOfMeasure] = useState<{ unitOfMeasureID: number; nombreUnidad: string }>({
    unitOfMeasureID: 0,
    nombreUnidad: "",
  });

  // 📌 Estado del modal de confirmación para edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEditValue, setPendingEditValue] = useState<string>("");

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Modal para agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewUnitOfMeasure("");
    setIsAddModalOpen(false);
  };

  // 📌 Modal para editar (corregido)
  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.unitOfMeasureID) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }

    console.log("🛠️ Editando:", item);
    setEditUnitOfMeasure({ unitOfMeasureID: item.unitOfMeasureID, nombreUnidad: item.nombreUnidad });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditUnitOfMeasure({ unitOfMeasureID: 0, nombreUnidad: "" });
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
      { id: editUnitOfMeasure.unitOfMeasureID, nombreUnidad: pendingEditValue },
      {
        onSuccess: () => {
          closeEditModal();
        },
      }
    );
  };

  // 📌 Modal para eliminar
  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.unitOfMeasureID) return;
    setUnitToDelete(item.unitOfMeasureID);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setUnitToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (unitToDelete !== null) {
      setIsDeleting(true);
      deleteEntity.mutate(unitToDelete, {
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

  const handleAddUnitOfMeasure = () => {
    if (newUnitOfMeasure.trim() === "") return;
    createEntity.mutate({ nombreUnidad: newUnitOfMeasure, unitOfMeasureID: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Unidades de Medida</h2>
        <div className="w-28"></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Unidades de Medida"
        columns={[{ key: "nombreUnidad", label: "Nombre" }]}
        data={unitOfMeasure || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal} // ✅ Ahora llama correctamente a openEditModal
        onDelete={(item) => openConfirmDeleteModal(item)}
        isDarkMode={false}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev))}
        onPreviousPage={() => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev))}
      />

      {/* 📌 Modal para Agregar */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Unidad de Medida" onClose={closeAddModal}>
        <input
          type="text"
          value={newUnitOfMeasure}
          onChange={(e) => setNewUnitOfMeasure(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre de la unidad de medida"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddUnitOfMeasure}>
            Guardar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal para Editar */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar Unidad de Medida"
        onClose={closeEditModal}
        onSave={handlePreConfirmEdit}
        initialValue={editUnitOfMeasure.nombreUnidad}
      />

      {/* 📌 Modal de Confirmación antes de editar */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar Edición"
        message={`¿Seguro que deseas editar la unidad de medida a "${pendingEditValue}"?`}
        confirmText="Confirmar"
        isLoading={false}
      />

      {/* 📌 Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Unidad de Medida"
        message="¿Estás seguro de que quieres eliminar esta unidad de medida?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableUnitOfMeasure;
