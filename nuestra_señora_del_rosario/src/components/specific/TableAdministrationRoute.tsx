import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import { useAdministrationRoute } from "../../hooks/useAdministrationRoute";
import { useManagmentAdministrationRoute } from "../../hooks/useManagmentAdministrationRoute";

const TableAdministrationRoute: React.FC = () => {
  const { data: adminRoutes, isLoading } = useAdministrationRoute();
  const { createEntity, updateEntity, deleteEntity, toast } =
    useManagmentAdministrationRoute();
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3; // Ajusta según tu lógica de paginación

  // Estado para el modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoute, setNewRoute] = useState<{ routeName: string }>({
    routeName: "",
  });

  // Estado para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRoute, setEditRoute] = useState<{
    id_AdministrationRoute: number;
    routeName: string;
  } | null>(null);

  // Estado para el modal de confirmación de edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] =
    useState(false);
  const [pendingEdit, setPendingEdit] = useState<{
    id_AdministrationRoute: number;
    routeName: string;
  } | null>(null);

  // Estado para el modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers para agregar
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewRoute({ routeName: "" });
    setIsAddModalOpen(false);
  };

  const handleAddRoute = () => {
    if (newRoute.routeName.trim() === "") return;
    createEntity.mutate({
      id_AdministrationRoute: 0,
      routeName: newRoute.routeName,
    });
    closeAddModal();
  };

  // Handlers para editar
  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_AdministrationRoute) return;
    setEditRoute({
      id_AdministrationRoute: item.id_AdministrationRoute,
      routeName: item.routeName,
    });
    setPendingEdit({
      id_AdministrationRoute: item.id_AdministrationRoute,
      routeName: item.routeName,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditRoute(null);
    setIsEditModalOpen(false);
  };

  const handleConfirmEdit = () => {
    if (!pendingEdit) return;
    setIsConfirmEditModalOpen(false);
    updateEntity.mutate(
      {
        id: pendingEdit.id_AdministrationRoute,
        routeName: pendingEdit.routeName,
      },
      {
        onSuccess: () => closeEditModal(),
      }
    );
  };

  // Handlers para eliminar
  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.id_AdministrationRoute) return;
    setRouteToDelete(item.id_AdministrationRoute);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setRouteToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (routeToDelete !== null) {
      setIsDeleting(true);
      deleteEntity.mutate(routeToDelete, {
        onSuccess: () => {
          setIsDeleting(false);
          closeConfirmDeleteModal();
        },
        onError: () => setIsDeleting(false),
      });
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Gestión de vías de administración
      </h2>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de vías de administración"
        columns={[
          { key: "routeName", label: "Nombre de la Vía" },
        ]}
        data={adminRoutes || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={(item) => openEditModal(item)}
        onDelete={(item) => openConfirmDeleteModal(item)}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() =>
          setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev))
        }
        onPreviousPage={() =>
          setPageNumber((prev) => (prev > 1 ? prev - 1 : prev))
        }
      />

      {/* Modal para Agregar Vía de Administración */}
      <AdminModalAdd
        isOpen={isAddModalOpen}
        title="Agregar vía de administración"
        onClose={closeAddModal}
      >
        <input
          type="text"
          value={newRoute.routeName}
          onChange={(e) => setNewRoute({ routeName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nombre de la vía"
        />
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleAddRoute}
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

      {/* Modal para Editar Vía de Administración */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar vía de administración"
        onClose={closeEditModal}
        onSave={(updatedValue) => {
          if (editRoute) {
            setPendingEdit({
              id_AdministrationRoute: editRoute.id_AdministrationRoute,
              routeName: updatedValue,
            });
            setIsConfirmEditModalOpen(true);
            closeEditModal();
          }
        }}
        initialValue={editRoute?.routeName || ""}
      />

      {/* Modal de Confirmación para Edición */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar Edición"
        message={`¿Seguro que deseas editar la vía a "${pendingEdit?.routeName}"?`}
        confirmText="Confirmar"
        isLoading={false}
      />

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar vía de administración"
        message="¿Estás seguro de que quieres eliminar esta vía de administración?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableAdministrationRoute;
