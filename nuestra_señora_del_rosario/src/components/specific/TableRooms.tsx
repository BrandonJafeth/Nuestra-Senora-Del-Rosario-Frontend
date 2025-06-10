import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useManagmentRoom } from "../../hooks/useManagmentRoom";
import { useRoom } from "../../hooks/useRoom";

const TableRooms: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentRoom();
  const { data: rooms, isLoading } = useRoom();
  const [pageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ roomNumber: "", capacity: "" });

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<{ id_Room: number; roomNumber: string; capacity: number; } | null>(null);

  // 📌 Estado del modal de confirmación antes de editar
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ id_Room: number; roomNumber: string; capacity: number } | null>(null);

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Modal para agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewRoom({ roomNumber: "", capacity: "" });
    setIsAddModalOpen(false);
  };

  // 📌 Modal para editar solo el número y la capacidad
  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_Room) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }
    setEditRoom({ id_Room: item.id_Room, roomNumber: item.roomNumber, capacity: item.capacity });
    setPendingEdit(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  // 📌 Confirmar edición
  const handleConfirmEdit = () => {
    if (!pendingEdit) return;
    setIsConfirmEditModalOpen(false);
    updateEntity.mutate(
      {
        id: pendingEdit.id_Room,
        roomNumber: pendingEdit.roomNumber,
        capacity: pendingEdit.capacity,
      },
      {
        onSuccess: () => closeEditModal(),
      }
    );
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_Room) return;
    setRoomToDelete(item.id_Room);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setRoomToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleAddRoom = () => {
    if (newRoom.roomNumber.trim() === "" || newRoom.capacity.trim() === "") return;
    createEntity.mutate({
      roomNumber: newRoom.roomNumber,
      capacity: Number(newRoom.capacity),
      id_Room: 0,
    });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Gestión de Habitaciones</h2>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de habitaciones"
        columns={[
          { key: "roomNumber", label: "Número" },
          { key: "capacity", label: "Capacidad" },
          { key: "availableSpots", label: "Espacios ocupados" },
        ]}
        data={rooms || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={openConfirmDeleteModal}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => {}}
        onPreviousPage={() => {}}
      />

      {/* 📌 Modal para Agregar */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar nueva habitación" onClose={closeAddModal}>
        <input
          type="number"
          value={newRoom.roomNumber}
          onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Número de habitación"
        />
        <input
          type="number"
          value={newRoom.capacity}
          onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Capacidad"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddRoom}>
            Guardar
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
        </div>
      </AdminModalAdd>

      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar numero de habitación"
        initialValue={editRoom?.roomNumber || ""}
        onClose={closeEditModal}
        onSave={(updatedValue) => {
          if (editRoom) {
            setPendingEdit({ id_Room: editRoom.id_Room, roomNumber: updatedValue, capacity: editRoom.capacity });
            setIsConfirmEditModalOpen(true);
            closeEditModal();
          }
        }}
      />

      {/* 📌 Modal de Confirmación para Edición */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message={`¿Seguro que deseas cambiar los datos de la habitación ${pendingEdit?.roomNumber}?`}
        confirmText="Confirmar"
      />

      {/* 📌 Modal de Confirmación para eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={() => {
          if (roomToDelete !== null) {
            setIsDeleting(true);
            deleteEntity.mutate(roomToDelete, {
              onSuccess: () => {
                setIsDeleting(false);
                closeConfirmDeleteModal();
              },
              onError: () => setIsDeleting(false),
            });
          }
        }}
        title="Eliminar habitación"
        message="¿Estás seguro de que quieres eliminar esta habitación?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableRooms;
