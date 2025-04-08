import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useBrand } from "../../hooks/useBrand";
import { useManagmentBrand } from "../../hooks/useManagmentBrand";

const TableBrands: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentBrand();
  const { data: brands, isLoading } = useBrand();
  const [pageNumber] = useState(1);
  const totalPages = 3; // Puedes ajustar el total de páginas según tu lógica

  // Estado para el modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({ brandName: "" });

  // Estado para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBrand, setEditBrand] = useState<{ idBrand: number; brandName: string } | null>(null);

  // Estado para el modal de confirmación de edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ idBrand: number; brandName: string } | null>(null);

  // Estado para el modal de confirmación de eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Funciones para abrir y cerrar modales
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewBrand({ brandName: "" });
    setIsAddModalOpen(false);
  };

  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.idBrand) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }
    setEditBrand({ idBrand: item.idBrand, brandName: item.brandName });
    setPendingEdit(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleConfirmEdit = () => {
    if (!pendingEdit) return;
    setIsConfirmEditModalOpen(false);
    updateEntity.mutate(
      {
        id: pendingEdit.idBrand,
        brandName: pendingEdit.brandName,
      },
      {
        onSuccess: () => closeEditModal(),
      }
    );
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.idBrand) return;
    setBrandToDelete(item.idBrand);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setBrandToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleAddBrand = () => {
    if (newBrand.brandName.trim() === "") return;
    createEntity.mutate({
      brandName: newBrand.brandName,
      idBrand: 0,
    });
    closeAddModal();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Gestión de Marcas</h2>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de marcas"
        columns={[
          { key: "brandName", label: "Marca" }
        ]}
        data={brands || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={openConfirmDeleteModal}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => {}}
        onPreviousPage={() => {}}
      />

      {/* Modal para Agregar Marca */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar nueva marca" onClose={closeAddModal}>
        <input
          type="text"
          value={newBrand.brandName}
          onChange={(e) => setNewBrand({ brandName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nombre de la marca"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddBrand}>
            Guardar
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={closeAddModal}>
            Cancelar
          </button>
        </div>
      </AdminModalAdd>

      {/* Modal para Editar Marca */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar marca"
        initialValue={editBrand?.brandName || ""}
        onClose={closeEditModal}
        onSave={(updatedValue) => {
          if (editBrand) {
            setPendingEdit({ idBrand: editBrand.idBrand, brandName: updatedValue });
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
        title="Confirmar edición"
        message={`¿Seguro que deseas cambiar el nombre de la marca ${pendingEdit?.brandName}?`}
        confirmText="Confirmar"
      />

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={() => {
          if (brandToDelete !== null) {
            setIsDeleting(true);
            deleteEntity.mutate(brandToDelete, {
              onSuccess: () => {
                setIsDeleting(false);
                closeConfirmDeleteModal();
              },
              onError: () => setIsDeleting(false),
            });
          }
        }}
        title="Eliminar marca"
        message="¿Estás seguro de que quieres eliminar esta marca?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableBrands;
