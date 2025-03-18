import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useLaw } from "../../hooks/useLaw";
import { useManagmentLaw } from "../../hooks/useManagmentLaw";

const TableLaws: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentLaw();
  const { data: laws, isLoading } = useLaw();
  const [pageNumber] = useState(1);
  const totalPages = 3; // Ajusta el total de páginas según tu lógica

  // Estado para el modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLaw, setNewLaw] = useState({ lawName: "", lawDescription: "" });

  // Estado para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLaw, setEditLaw] = useState<{ idLaw: number; lawName: string; lawDescription: string } | null>(null);

  // Estado para el modal de confirmación de edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ idLaw: number; lawName: string; lawDescription: string } | null>(null);

  // Estado para el modal de confirmación de eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [lawToDelete, setLawToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Funciones para abrir y cerrar modales
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewLaw({ lawName: "", lawDescription: "" });
    setIsAddModalOpen(false);
  };

  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.idLaw) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }
    setEditLaw({ idLaw: item.idLaw, lawName: item.lawName, lawDescription: item.lawDescription });
    setPendingEdit({ idLaw: item.idLaw, lawName: item.lawName, lawDescription: item.lawDescription });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleConfirmEdit = () => {
    if (!pendingEdit) return;
    setIsConfirmEditModalOpen(false);
    updateEntity.mutate(
      {
        id: pendingEdit.idLaw,
        lawName: pendingEdit.lawName,
        lawDescription: pendingEdit.lawDescription,
      },
      {
        onSuccess: () => closeEditModal(),
      }
    );
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.idLaw) return;
    setLawToDelete(item.idLaw);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setLawToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleAddLaw = () => {
    if (newLaw.lawName.trim() === "") return;
    createEntity.mutate({
      lawName: newLaw.lawName,
      lawDescription: newLaw.lawDescription,
      idLaw: 0,
    });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Gestión de Leyes</h2>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Leyes"
        columns={[
          { key: "lawName", label: "Nombre de la Ley" },
          { key: "lawDescription", label: "Descripción" }
        ]}
        data={laws || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={openConfirmDeleteModal}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => {}}
        onPreviousPage={() => {}}
      />

      {/* Modal para Agregar Ley */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nueva Ley" onClose={closeAddModal}>
        <input
          type="text"
          value={newLaw.lawName}
          onChange={(e) => setNewLaw({ ...newLaw, lawName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nombre de la Ley"
        />
        <textarea
          value={newLaw.lawDescription}
          onChange={(e) => setNewLaw({ ...newLaw, lawDescription: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Descripción de la Ley"
          rows={3}
        ></textarea>
        <div className="flex justify-center space-x-4">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" 
            onClick={handleAddLaw}
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

      {/* Modal para Editar Ley */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar Ley"
        initialValue={editLaw?.lawName || ""}
        onClose={closeEditModal}
        onSave={(updatedValue) => {
          if (editLaw) {
            setPendingEdit({ 
              idLaw: editLaw.idLaw, 
              lawName: updatedValue, 
              lawDescription: editLaw.lawDescription 
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
        title="Confirmar Edición"
        message={`¿Seguro que deseas cambiar el nombre de la ley ${pendingEdit?.lawName}?`}
        confirmText="Confirmar"
      />

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={() => {
          if (lawToDelete !== null) {
            setIsDeleting(true);
            deleteEntity.mutate(lawToDelete, {
              onSuccess: () => {
                setIsDeleting(false);
                closeConfirmDeleteModal();
              },
              onError: () => setIsDeleting(false),
            });
          }
        }}
        title="Eliminar Ley"
        message="¿Estás seguro de que quieres eliminar esta ley?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableLaws;