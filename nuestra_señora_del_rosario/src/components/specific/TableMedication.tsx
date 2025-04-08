import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import AdminModalEdit from "../microcomponents/AdminModalEdit";
import { useMedicationSpecific } from "../../hooks/useMedicationSpecific";
import { useManagmentMedication } from "../../hooks/useManagmentMedication";

// Importa los hooks para obtener la lista de vías y unidades
import { useAdministrationRoute } from "../../hooks/useAdministrationRoute";
import { useUnitOfMeasure } from "../../hooks/useUnitOfMeasure";

const TableMedicationSpecific: React.FC = () => {
  const { data: medicationSpecificList, isLoading } = useMedicationSpecific();
  const { createEntity, updateEntity, deleteEntity, toast } = useManagmentMedication();

  // Hooks para vías de administración y unidades de medida
  const { data: routes, isLoading: isLoadingRoutes } = useAdministrationRoute();
  const { data: units, isLoading: isLoadingUnits } = useUnitOfMeasure();

  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3; // Ajusta según tu lógica de paginación

  // -----------------------------------------------------
  //  ESTADO PARA AGREGAR
  // -----------------------------------------------------
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({
    medicationName: "",
    medicationDescription: "",
    administrationSchedule: "",
    unitofMeasureId: 0,
    id_AdministrationRoute: 0,
  });

  // -----------------------------------------------------
  //  ESTADO PARA EDITAR
  // -----------------------------------------------------
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMedication, setEditMedication] = useState<{
    idMedicationSpecific: number;
    medicationName: string;
    medicationDescription: string;
  } | null>(null);

  // Modal de confirmación para editar
  const [isConfirmEditModalOpen, setIsConfirmEditModalOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{
    idMedicationSpecific: number;
    medicationName: string;
    medicationDescription: string;
  } | null>(null);

  // -----------------------------------------------------
  //  ESTADO PARA ELIMINAR
  // -----------------------------------------------------
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<number | null>(null);
  // Guarda también el nombre para mostrarlo en el modal
  const [medicationNameToDelete, setMedicationNameToDelete] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);

  // -----------------------------------------------------
  //  FUNCIONES PARA AGREGAR
  // -----------------------------------------------------
  const openAddModal = () => setIsAddModalOpen(true);

  const closeAddModal = () => {
    setNewMedication({
      medicationName: "",
      medicationDescription: "",
      administrationSchedule: "",
      unitofMeasureId: 0,
      id_AdministrationRoute: 0,
    });
    setIsAddModalOpen(false);
  };

  const handleAddMedication = () => {
    if (newMedication.medicationName.trim() === "") return;

    createEntity.mutate({
      id_MedicamentSpecific: 0,
      name_MedicamentSpecific: newMedication.medicationName,
      specialInstructions: newMedication.medicationDescription,
      administrationSchedule: newMedication.administrationSchedule,
      unitofMeasureId: newMedication.unitofMeasureId,
      id_AdministrationRoute: newMedication.id_AdministrationRoute,
      unitOfMeasureName: "",
      routeName: "",
      createdAt: "",
      updatedAt: "",
    });

    closeAddModal();
  };

  // -----------------------------------------------------
  //  FUNCIONES PARA EDITAR
  // -----------------------------------------------------
  const openEditModal = (item: any) => {
    // Verifica usando el nombre correcto de la propiedad, por ejemplo, id_MedicamentSpecific
    if (!item || typeof item !== "object" || !item.id_MedicamentSpecific) return;
  
    // Asigna las propiedades transformándolas si lo deseas a camelCase en el estado local
    setEditMedication({
      idMedicationSpecific: item.id_MedicamentSpecific, // usamos la propiedad real
      medicationName: item.name_MedicamentSpecific,       // se usa el nombre que viene del backend
      medicationDescription: item.specialInstructions,    // se asigna la descripción/instrucciones
    });
  
    setPendingEdit({
      idMedicationSpecific: item.id_MedicamentSpecific,
      medicationName: item.name_MedicamentSpecific,
      medicationDescription: item.specialInstructions,
    });
  
    setIsEditModalOpen(true);
  };
  

  const closeEditModal = () => {
    setEditMedication(null);
    setIsEditModalOpen(false);
  };

  const handleConfirmEdit = () => {
    if (!pendingEdit) return;
    setIsConfirmEditModalOpen(false);

    updateEntity.mutate(
      {
        id: pendingEdit.idMedicationSpecific,
        name_MedicamentSpecific: pendingEdit.medicationName,
        specialInstructions: pendingEdit.medicationDescription,
      },
      {
        onSuccess: () => closeEditModal(),
      }
    );
  };

  // -----------------------------------------------------
  //  FUNCIONES PARA ELIMINAR
  // -----------------------------------------------------
  const openConfirmDeleteModal = (item: any) => {
    // Cambia la verificación a la propiedad real
    if (!item || typeof item !== "object" || !item.id_MedicamentSpecific) return;
  
    // Guarda el ID en el estado
    setMedicationToDelete(item.id_MedicamentSpecific);
  
    // Guarda el nombre
    setMedicationNameToDelete(item.name_MedicamentSpecific ?? "este medicamento");
  
    // Ahora sí abres el modal
    setIsConfirmDeleteModalOpen(true);
  };
  
  

  const closeConfirmDeleteModal = () => {
    setMedicationToDelete(null);
    setMedicationNameToDelete("");
    setIsConfirmDeleteModalOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (medicationToDelete !== null) {
      setIsDeleting(true);
      deleteEntity.mutate(medicationToDelete, {
        onSuccess: () => {
          setIsDeleting(false);
          closeConfirmDeleteModal();
        },
        onError: () => setIsDeleting(false),
      });
    }
  };

  // -----------------------------------------------------
  //  RENDER
  // -----------------------------------------------------
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Gestión de medicamentos específicos
      </h2>

      {/* Si hay mensaje de éxito/error */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Tabla principal */}
      <AdminTable
        title="Lista de Medicamentos Específicos"
        columns={[
          { key: "name_MedicamentSpecific", label: "Nombre" },
          { key: "specialInstructions", label: "Instrucciones" },
          { key: "routeName", label: "Ruta de administración" },
        ]}
        data={medicationSpecificList?.data || []}
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

      {/* Modal para Agregar */}
      <AdminModalAdd
        isOpen={isAddModalOpen}
        title="Agregar medicamento específico"
        onClose={closeAddModal}
      >
        {/* Nombre del Medicamento */}
        <input
          type="text"
          value={newMedication.medicationName}
          onChange={(e) =>
            setNewMedication({ ...newMedication, medicationName: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nombre del medicamento"
        />

        {/* Descripción/Instrucciones */}
        <textarea
          value={newMedication.medicationDescription}
          onChange={(e) =>
            setNewMedication({
              ...newMedication,
              medicationDescription: e.target.value,
            })
          }
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Descripción o instrucciones especiales"
          rows={3}
        ></textarea>

        {/* Horario de administración */}
        <input
          type="text"
          value={newMedication.administrationSchedule}
          onChange={(e) =>
            setNewMedication({
              ...newMedication,
              administrationSchedule: e.target.value,
            })
          }
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Horario de administración"
        />

        {/* Dropdown de Unidad de Medida */}
        <label className="block mb-2 font-semibold">Unidad de Medida</label>
        {isLoadingUnits ? (
          <p>Cargando unidades...</p>
        ) : (
          <select
            value={newMedication.unitofMeasureId}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                unitofMeasureId: parseInt(e.target.value, 10),
              })
            }
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          >
            <option value={0}>Seleccione una unidad de medida</option>
            {units?.map((u) => (
              <option key={u.unitOfMeasureID} value={u.unitOfMeasureID}>
                {u.nombreUnidad}
              </option>
            ))}
          </select>
        )}

        {/* Dropdown de Vía de Administración */}
        <label className="block mb-2 font-semibold">Vía de Administración</label>
        {isLoadingRoutes ? (
          <p>Cargando vías...</p>
        ) : (
          <select
            value={newMedication.id_AdministrationRoute}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                id_AdministrationRoute: parseInt(e.target.value, 10),
              })
            }
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          >
            <option value={0}>Seleccione una vía de administración</option>
            {routes?.map((r) => (
              <option key={r.id_AdministrationRoute} value={r.id_AdministrationRoute}>
                {r.routeName}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleAddMedication}
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

      {/* Modal para Editar */}
      <AdminModalEdit
        isOpen={isEditModalOpen}
        title="Editar medicamento específico"
        onClose={closeEditModal}
        onSave={(updatedValue) => {
          if (editMedication) {
            setPendingEdit({
              idMedicationSpecific: editMedication.idMedicationSpecific,
              medicationName: updatedValue,
              medicationDescription: editMedication.medicationDescription,
            });
            setIsConfirmEditModalOpen(true);
            closeEditModal();
          }
        }}
        initialValue={editMedication?.medicationName || ""}
      />

      {/* Modal de Confirmación para Edición */}
      <ConfirmationModal
        isOpen={isConfirmEditModalOpen}
        onClose={() => setIsConfirmEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar edición"
        message={`¿Seguro que deseas editar el medicamento a "${pendingEdit?.medicationName}"?`}
        confirmText="Confirmar"
        isLoading={false}
      />

<ConfirmationModal
  isOpen={isConfirmDeleteModalOpen}
  onClose={closeConfirmDeleteModal}
  onConfirm={handleDeleteConfirmed}
  title="Eliminar medicamento"
  message={`¿Estás seguro de que quieres eliminar "${medicationNameToDelete}"?`}
  confirmText="Eliminar"
  isLoading={isDeleting}
/>

    </div>
  );
};

export default TableMedicationSpecific;
