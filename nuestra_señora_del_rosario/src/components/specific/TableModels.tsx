import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEditWithBrand from "../microcomponents/AdminModalEditWithBrand";
import { useManagmentModel } from "../../hooks/useManagmentModel";
import { useModel } from "../../hooks/useModel";
import { useBrand } from "../../hooks/useBrand";

interface ModelEditType {
  idModel: number;
  modelName: string;
  brandName: string;
  idBrand: number;
}

const TableModels: React.FC = () => {
  const { deleteEntity, createEntity, updateEntity, toast } = useManagmentModel();
  const { data: models, isLoading } = useModel();
  const { data: brands = [], isLoading: isLoadingBrands } = useBrand();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

    const totalPages = Math.ceil(brands.length / pageSize);


  // Estado para el modal de agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModel, setNewModel] = useState({ modelName: "", idBrand: 0 });

  // Estado para el modal de edición (incluye idBrand)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModel, setEditModel] = useState<ModelEditType | null>(null);

  // Estado para la confirmación de edición
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<ModelEditType | null>(null);

  // Estado para la confirmación de eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Funciones para abrir y cerrar modales
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setNewModel({ modelName: "", idBrand: 0 });
    setIsAddModalOpen(false);
  };

  const openEditModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.idModel) {
      console.error("🚨 Error: Datos inválidos para edición", item);
      return;
    }
    const modelToEdit: ModelEditType = {
      idModel: item.idModel,
      modelName: item.modelName,
      brandName: item.brandName,
      idBrand: item.idBrand,
    };
    setEditModel(modelToEdit);
    setPendingEdit(modelToEdit);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleConfirmEdit = () => {
    if (!pendingEdit) return;
    setIsConfirmEditModalOpen(false);
    updateEntity.mutate(
      {
        id: pendingEdit.idModel,
        modelName: pendingEdit.modelName,
        brandName: pendingEdit.brandName,
        idBrand: pendingEdit.idBrand,
      },
      {
        onSuccess: () => closeEditModal(),
      }
    );
  };

  const openConfirmDeleteModal = (item: any) => {
    if (!item || typeof item !== "object" || !item.idModel) return;
    setModelToDelete(item.idModel);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setModelToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleAddModel = () => {
    if (newModel.modelName.trim() === "" || newModel.idBrand === 0) return;
    const selectedBrand = brands?.find((brand) => brand.idBrand === newModel.idBrand);
    createEntity.mutate({
      modelName: newModel.modelName,
      brandName: selectedBrand ? selectedBrand.brandName : "",
      idModel: 0, // Nuevo registro
      idBrand: newModel.idBrand,
    });
    closeAddModal();
  };

  return (
    <div className="p-8">
<div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión de modelos</h2>
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
        title="Lista de modelos"
        columns={[
          { key: "modelName", label: "Modelo" },
          { key: "brandName", label: "Marca" }
        ]}
        data={models || []}
        isLoading={isLoading || isLoadingBrands}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={openConfirmDeleteModal}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
        onPreviousPage={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
        itemsPerPage={pageSize}
      />

      {/* Modal para Agregar Modelo */}
      <AdminModalAdd isOpen={isAddModalOpen} title="Agregar nuevo modelo" onClose={closeAddModal}>
        <input
          type="text"
          value={newModel.modelName}
          onChange={(e) => setNewModel({ ...newModel, modelName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nombre del modelo"
        />
        <select
          value={newModel.idBrand}
          onChange={(e) => setNewModel({ ...newModel, idBrand: parseInt(e.target.value) })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        >
          <option value={0}>Seleccione una marca</option>
          {brands?.map((brand) => (
            <option key={brand.idBrand} value={brand.idBrand}>
              {brand.brandName}
            </option>
          ))}
        </select>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleAddModel}
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

      {/* Modal para Editar Modelo con opción de cambiar Marca */}
      {brands && editModel && (
        <AdminModalEditWithBrand
          isOpen={isEditModalOpen}
          title="Editar modelo"
          initialModelName={editModel.modelName}
          initialIdBrand={editModel.idBrand}
          brands={brands}
          onClose={closeEditModal}
          onSave={(updatedName, updatedIdBrand) => {
            setPendingEdit({
              idModel: editModel.idModel,
              modelName: updatedName,
              brandName: brands.find((b) => b.idBrand === updatedIdBrand)?.brandName || "",
              idBrand: updatedIdBrand,
            });
            setIsConfirmEditModalOpen(true);
            closeEditModal();
          }}
        />
      )}

      {/* Modal de Confirmación para Edición */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message={`¿Seguro que deseas cambiar el modelo a ${pendingEdit?.modelName}?`}
        confirmText="Confirmar"
      />

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={() => {
          if (modelToDelete !== null) {
            setIsDeleting(true);
            deleteEntity.mutate(modelToDelete, {
              onSuccess: () => {
                setIsDeleting(false);
                closeConfirmDeleteModal();
              },
              onError: () => setIsDeleting(false),
            });
          }
        }}
        title="Eliminar modelo"
        message="¿Estás seguro de que quieres eliminar este modelo?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableModels;
