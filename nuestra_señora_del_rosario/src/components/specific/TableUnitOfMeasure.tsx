import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import { useManagmentUnitOfMeasure } from "../../hooks/useManagmentUnitOfMeasure";
import { useUnitOfMeasure } from "../../hooks/useUnitOfMeasure";
import AdminModalAdd from "../microcomponents/AdminModalAdd";

const TableUnitOfMeasure: React.FC = () => {
  const { deleteUnitOfMeasure, createUnitOfMeasure, toast } = useManagmentUnitOfMeasure();
  const { data: unitOfMeasure, isLoading } = useUnitOfMeasure();
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUnitOfMeasure, setNewUnitOfMeasure] = useState("");

  // Estado del modal de confirmación para eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Abrir el modal de confirmación de eliminación
  const openConfirmDeleteModal = (item: any) => {
    console.log("🛠️ Intentando eliminar:", item); // Verificar los datos del item
    if (item?.unitOfMeasureID) {
      setUnitToDelete(item.unitOfMeasureID);
      setIsConfirmDeleteModalOpen(true);
    } else {
      console.error("🚨 Error: ID de unidad de medida no definido", item);
    }
  };

  // Cerrar el modal de confirmación de eliminación
  const closeConfirmDeleteModal = () => {
    setUnitToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  // Confirmar eliminación
  const handleDeleteConfirmed = () => {
    if (unitToDelete !== null) {
      setIsDeleting(true);
      deleteUnitOfMeasure.mutate(unitToDelete, {
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Unidades de Medida</h2>
        <div className="w-28"></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
              title="Lista de Unidades de Medida"
              columns={[
                  { key: "nombreUnidad", label: "Nombre" },
              ]}
              data={unitOfMeasure || []}
              isLoading={isLoading}
              onAdd={() => setIsAddModalOpen(true)}
              onEdit={(item) => console.log("Editar", item)}
              onDelete={(item) => openConfirmDeleteModal(item)}
              isDarkMode={false}
              pageNumber={pageNumber}
              totalPages={totalPages}
              onNextPage={() => setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev))}
              onPreviousPage={() => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev))}
         />

<AdminModalAdd isOpen={isAddModalOpen} title="Agregar Nueva Unidad de Medida" onClose={() => setIsAddModalOpen(false)}>
        <input
          type="text"
          value={newUnitOfMeasure}
          onChange={(e) => setNewUnitOfMeasure(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre de la unidad de medida"
        />
        <div className="flex justify-center space-x-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => setIsAddModalOpen(false)}>
            Cancelar
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 "
          onClick={() => {
              createUnitOfMeasure.mutate({ nombreUnidad: newUnitOfMeasure, unitOfMeasureID: 0 });
              setNewUnitOfMeasure("");
              setIsAddModalOpen(false);
            }}
            >
          Guardar
        </button>
            </div>
      </AdminModalAdd>

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Unidad de Medida"
        message="¿Estás seguro de que quieres eliminar esta Unidad de Medida?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TableUnitOfMeasure;
