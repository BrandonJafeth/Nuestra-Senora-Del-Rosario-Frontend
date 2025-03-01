import React, { useState } from "react";
import { useManagmentRoom } from "../../hooks/useManagmentRoom";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import { useRoom } from "../../hooks/useRoom";

const TableRooms: React.FC = () => {
  const { createRoom, deleteRoom, toast } = useManagmentRoom();
  const { data: rooms, isLoading } = useRoom();
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ roomNumber: "", capacity: "" });

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Funciones para abrir/cerrar el modal de agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewRoom({ roomNumber: "", capacity: "" });
    setIsAddModalOpen(false);
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object") {
      return;
    }
    if (!item.id_Room) {
      return;
    }
    setRoomToDelete(item.id_Room);
    setIsConfirmDeleteModalOpen(true);
  };

  // 📌 Cerrar el modal de confirmación de eliminación
  const closeConfirmDeleteModal = () => {
    setRoomToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  // 📌 Confirmar eliminación
  const handleDeleteConfirmed = () => {
    if (roomToDelete !== null) {
      setIsDeleting(true);
      deleteRoom.mutate(roomToDelete, {
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

  // 📌 Agregar una habitación
  const handleAddRoom = () => {
    if (newRoom.roomNumber.trim() === "" || newRoom.capacity.trim() === "") return;
    createRoom.mutate({
      roomNumber: newRoom.roomNumber,
      capacity: Number(newRoom.capacity),
      id_Room: 0
    });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión de Habitaciones</h2>
        <div className="w-28"></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Habitaciones"
        columns={[
          { key: "roomNumber", label: "Número" },
          { key: "capacity", label: "Capacidad" },
        ]}
        data={rooms || []}
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
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nueva Habitación" onClose={closeAddModal}>
        <input
          type="number"
          value={newRoom.roomNumber}
          onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el número de la habitación"
        />
        <input
          type="number"
          value={newRoom.capacity}
          onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese la capacidad de la habitación"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 " onClick={closeAddModal}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 " onClick={handleAddRoom}>
            Guardar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Habitación"
        message="¿Estás seguro de que quieres eliminar esta Habitación?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableRooms;
