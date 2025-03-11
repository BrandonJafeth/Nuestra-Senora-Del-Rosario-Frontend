import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useManagmentPathologies } from "../../hooks/useManagmentPathologies";
import { usePathologies } from "../../hooks/usePathology";

const TablePathologies: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentPathologies();
  const { data: pathologies, isLoading } = usePathologies();
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPathology, setNewPathology] = useState("");

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPathology, setEditPathology] = useState<{ id_Pathology: number; name_Pathology: string }>({
    id_Pathology: 0,
    name_Pathology: "",
  });

  // 📌 Estado del modal de confirmación para edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEditValue, setPendingEditValue] = useState<string>("");

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [pathologyToDelete, setPathologyToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Modal para agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewPathology("");
    setIsAddModalOpen(false);
  };

  // 📌 Modal para editar (corregido)
  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_Pathology) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }

    console.log("🛠️ Editando:", item);
    setEditPathology({ id_Pathology: item.id_Pathology, name_Pathology: item.name_Pathology });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditPathology({ id_Pathology: 0, name_Pathology: "" });
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
      { id: editPathology.id_Pathology, name_Pathology: pendingEditValue },
      {
        onSuccess: () => {
          closeEditModal();
        },
      }
    );
  };

  // 📌 Modal para eliminar
  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_Pathology) return;
    setPathologyToDelete(item.id_Pathology);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setPathologyToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (pathologyToDelete !== null) {
      setIsDeleting(true);
      deleteEntity.mutate(pathologyToDelete, {
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

  const handleAddPathology = () => {
    if (newPathology.trim() === "") return;
    createEntity.mutate({ name_Pathology: newPathology, id_Pathology: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Gestión de Patologías</h2>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Patologías"
        columns={[{ key: "name_Pathology", label: "Nombre" }]}
        data={pathologies || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={openConfirmDeleteModal}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev))}
        onPreviousPage={() => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev))}
      />

<AdminModalAdd isOpen={isAddModalOpen} title="Agregar Unidad de Medida" onClose={closeAddModal}>
        <input
          type="text"
          value={newPathology}
          onChange={(e) => setNewPathology(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre de la unidad de medida"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddPathology}>
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
        title="Editar Patología"
        onClose={closeEditModal}
        onSave={handlePreConfirmEdit}
        initialValue={editPathology.name_Pathology}
      />

      {/* 📌 Modal de Confirmación antes de editar */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar Edición"
        message={`¿Seguro que deseas editar la patología a "${pendingEditValue}"?`}
        confirmText="Confirmar"
        isLoading={false}
      />

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

export default TablePathologies;
