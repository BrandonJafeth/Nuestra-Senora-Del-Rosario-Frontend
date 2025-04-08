import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useManagmentHealtcareCenter } from "../../hooks/useManagmentHealtcareCenter";
import { useHealthcareCenters } from "../../hooks/useHealthcareCenters";

const TableHealthcareCenter: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentHealtcareCenter();
  const { data: healthcareCenters, isLoading } = useHealthcareCenters();
  const [pageNumber] = useState(1);
  const totalPages = 3;

  // 📌 Estado del modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHealthcareCenter, setNewHealthcareCenter] = useState({ name_HC: "", location_HC: "", type_HC: "Público" });

  // 📌 Estado del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editHealthcareCenter, setEditHealthcareCenter] = useState<{ id_HC: number; name_HC: string; location_HC: string; type_HC: string }>({
    id_HC: 0,
    name_HC: "",
    location_HC: "",
    type_HC: "Público",
  });

  // 📌 Estado del modal de confirmación antes de editar
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEditName, setPendingEditName] = useState<string>("");

  // 📌 Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [healthcareCenterToDelete, setHealthcareCenterToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 📌 Modal para agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewHealthcareCenter({ name_HC: "", location_HC: "", type_HC: "Público" });
    setIsAddModalOpen(false);
  };

  // 📌 Modal para editar solo el nombre
  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_HC) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }

    setEditHealthcareCenter({
      id_HC: item.id_HC, // ✅ Se mantiene el ID correctamente
      name_HC: item.name_HC,
      location_HC: item.location_HC,
      type_HC: item.type_HC,
    });

    setPendingEditName(item.name_HC); // ✅ Solo se edita el nombre
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // 📌 Confirmación antes de editar
  const handlePreConfirmEdit = (updatedName: string) => {
    setPendingEditName(updatedName);
    setIsConfirmEditModalOpen(true);
  };

  // 📌 Ejecutar edición después de confirmación
  const handleConfirmEdit = () => {
    setIsConfirmEditModalOpen(false);
    updateEntity.mutate(
      {
        id: editHealthcareCenter.id_HC, // ✅ Asegurar que el ID está presente
        name_HC: pendingEditName, // ✅ Solo se actualiza el nombre
        location_HC: editHealthcareCenter.location_HC, // Se mantiene la ubicación
        type_HC: editHealthcareCenter.type_HC, // Se mantiene el tipo
      },
      {
        onSuccess: () => {
          closeEditModal();
        },
      }
    );
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_HC) return;
    setHealthcareCenterToDelete(item.id_HC);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setHealthcareCenterToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };


  const handleAddHealthcareCenter = () => {
    if (
      newHealthcareCenter.name_HC.trim() === "" ||
      newHealthcareCenter.location_HC.trim() === ""
    )
      return;
    createEntity.mutate({
      name_HC: newHealthcareCenter.name_HC,
      location_HC: newHealthcareCenter.location_HC,
      type_HC: newHealthcareCenter.type_HC,
      id_HC: 0,
    });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Gestión de Centros de Atención</h2>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de centros de atención"
        columns={[
          { key: "name_HC", label: "Nombre" },
          { key: "location_HC", label: "Ubicación" },
          { key: "type_HC", label: "Tipo" },
        ]}
        data={healthcareCenters || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={openConfirmDeleteModal}
        pageNumber={pageNumber}
        totalPages={totalPages} onNextPage={function (): void {
          throw new Error("Function not implemented.");
        } } onPreviousPage={function (): void {
          throw new Error("Function not implemented.");
        } }      />

<AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nuevo Centro de Atención" onClose={closeAddModal}>
        <input
          type="text"
          value={newHealthcareCenter.name_HC}
          onChange={(e) => setNewHealthcareCenter({ ...newHealthcareCenter, name_HC: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre del centro"
        />
        <input
          type="text"
          value={newHealthcareCenter.location_HC}
          onChange={(e) => setNewHealthcareCenter({ ...newHealthcareCenter, location_HC: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese la ubicación"
        />

        {/* 📌 Dropdown para Tipo de Centro de Atención */}
        <select
          value={newHealthcareCenter.type_HC}
          onChange={(e) => setNewHealthcareCenter({ ...newHealthcareCenter, type_HC: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        >
          <option value="Público">Público</option>
          <option value="Privado">Privado</option>
        </select>

        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddHealthcareCenter}>
            Guardar
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
        </div>
      </AdminModalAdd>

      {/* 📌 Modal para Editar solo el Nombre */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar nombre del centro de atención"
        onClose={closeEditModal}
        onSave={handlePreConfirmEdit}
        initialValue={pendingEditName} // ✅ Solo permite editar el nombre
      />

      {/* 📌 Modal de Confirmación antes de editar */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message={`¿Seguro que deseas cambiar el nombre a "${pendingEditName}"?`}
        confirmText="Confirmar"
        isLoading={false}
      />

      {/* 📌 Modal de Confirmación para eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={() => {
          if (healthcareCenterToDelete !== null) {
            setIsDeleting(true);
            deleteEntity.mutate(healthcareCenterToDelete, {
              onSuccess: () => {
                setIsDeleting(false);
                closeConfirmDeleteModal();
              },
              onError: () => {
                setIsDeleting(false);
              },
            });
          }
        }}
        title="Eliminar centro de atención"
        message="¿Estás seguro de que quieres eliminar este centro de atención?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableHealthcareCenter;
