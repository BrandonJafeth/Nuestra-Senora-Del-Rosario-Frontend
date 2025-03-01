import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import { useManagmentNote } from "../../hooks/useManagmentNote";
import { useNotes } from "../../hooks/useNotes";

const TableNotes: React.FC = () => {
  const { data : notes, isLoading} = useNotes();
  const {createNote, deleteNote, toast} = useManagmentNote()
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ reason: "", noteDate: "", description: "" });

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewNote({ reason: "", noteDate: "", description: "" });
    setIsAddModalOpen(false);
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object") return;
    if (!item.id_Note) return;
    setNoteToDelete(item.id_Note);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setNoteToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (noteToDelete !== null) {
      setIsDeleting(true);
      deleteNote.mutate(noteToDelete, {
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

  const handleAddNote = () => {
    if (newNote.reason.trim() === "" || newNote.noteDate.trim() === "" || newNote.description.trim() === "") return;
    createNote.mutate({ reason: newNote.reason, noteDate: newNote.noteDate, description: newNote.description, id_Note: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión de Notas</h2>
        <div className="w-28"></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Notas"
        columns={[
          { key: "reason", label: "Motivo" },
          { key: "noteDate", label: "Fecha" },
          { key: "description", label: "Descripción" },
        ]}
        data={notes || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={(item) => console.log("Editar:", item)}
        onDelete={(item) => openConfirmDeleteModal(item)}
        isDarkMode={false}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev))}
        onPreviousPage={() => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev))}
      />

      {/* 📌 Modal para Agregar */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nueva Nota" onClose={closeAddModal}>
        <input
          type="text"
          value={newNote.reason}
          onChange={(e) => setNewNote({ ...newNote, reason: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el motivo"
        />
        <input
          type="date"
          value={newNote.noteDate}
          onChange={(e) => setNewNote({ ...newNote, noteDate: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <textarea
          value={newNote.description}
          onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese la descripción"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddNote}>
            Guardar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Nota"
        message="¿Estás seguro de que quieres eliminar esta nota?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableNotes;
