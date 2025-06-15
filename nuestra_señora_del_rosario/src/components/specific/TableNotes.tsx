import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit"; // ✅ Importado correctamente
import { useManagmentNote } from "../../hooks/useManagmentNote";
import { useNotes } from "../../hooks/useNotes";

const TableNotes: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentNote();
  const { data: notes = [], isLoading } = useNotes();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

    const totalPages = Math.ceil(notes.length / pageSize);


  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ reason: "", noteDate: "", description: "" });

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<{ id_Note: number; reason: string; noteDate: string; description: string }>({
    id_Note: 0,
    reason: "",
    noteDate: "",
    description: "",
  });

  // 📌 Estado del modal de confirmación para edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEditValue, setPendingEditValue] = useState<string>("");

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Modal para agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewNote({ reason: "", noteDate: "", description: "" });
    setIsAddModalOpen(false);
  };

  // 📌 Modal para editar
  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_Note) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }

    setEditNote({ id_Note: item.id_Note, reason: item.reason, noteDate: item.noteDate, description: item.description });
    setPendingEditValue(item.description); // ✅ Se edita solo la descripción en el modal
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditNote({ id_Note: 0, reason: "", noteDate: "", description: "" });
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
      { id: editNote.id_Note, reason: editNote.reason, noteDate: editNote.noteDate, description: pendingEditValue },
      {
        onSuccess: () => {
          closeEditModal();
        },
      }
    );
  };

  // 📌 Modal para eliminar
  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_Note) return;
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
      deleteEntity.mutate(noteToDelete, {
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
    createEntity.mutate({ reason: newNote.reason, noteDate: newNote.noteDate, description: newNote.description, id_Note: 0 });
    closeAddModal();
  };

  return (
    <div className="p-8">
<div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión de notas médicas</h2>
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
        title="Lista de Notas"
        columns={[
          { key: "reason", label: "Motivo" },
          { key: "noteDate", label: "Fecha" },
          { key: "description", label: "Descripción" },
        ]}
        data={notes || []}
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

<AdminModalAdd isOpen={isAddModalOpen} title="Agregar nueva nota" onClose={closeAddModal}>
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
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddNote}>
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
        title="Editar nota"
        onClose={closeEditModal}
        onSave={handlePreConfirmEdit}
        initialValue={pendingEditValue} // ✅ Solo se edita la descripción en el modal
      />

      {/* 📌 Modal de Confirmación antes de editar */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message="¿Seguro que deseas editar esta nota?"
        confirmText="Confirmar"
        isLoading={false}
      />

      {/* 📌 Modal de Confirmación para eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar nota"
        message="¿Estás seguro de que quieres eliminar esta nota?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableNotes;
