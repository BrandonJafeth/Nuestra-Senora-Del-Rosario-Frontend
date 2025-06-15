import React, { useState } from "react";
import AdminTable from "../microcomponents/AdminTable";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import { useMedicationSpecific } from "../../hooks/useMedicationSpecific";
import { useManagmentMedication } from "../../hooks/useManagmentMedication";
import { MedicationSpecific } from "../../types/MedicationSpecificType";

// Importa los hooks para obtener la lista de vías y unidades
import { useAdministrationRoute } from "../../hooks/useAdministrationRoute";
import { useUnitOfMeasure } from "../../hooks/useUnitOfMeasure";

const TableMedicationSpecific: React.FC = () => {
  const { data: medicationSpecificList, isLoading } = useMedicationSpecific();
  const { createEntity, updateEntity, deleteEntity, toast } = useManagmentMedication();

  // Hooks para vías de administración y unidades de medida
  const { data: routes, isLoading: isLoadingRoutes } = useAdministrationRoute();
  const { data: units = [], isLoading: isLoadingUnits } = useUnitOfMeasure();
  
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = Math.ceil(units.length / pageSize);

  // -----------------------------------------------------
  //  ESTADO PARA AGREGAR
  // -----------------------------------------------------
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({
    medicationName: "",
    medicationDescription: "",
    administrationSchedule: "",
    unitOfMeasureID: 0,
    id_AdministrationRoute: 0,
  });

  // -----------------------------------------------------
  //  ESTADO PARA EDITAR (Modal similar al de productos)
  // -----------------------------------------------------
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<MedicationSpecific | null>(null);
  const [editFormData, setEditFormData] = useState({
    medicationName: "",
    medicationDescription: "",
    administrationSchedule: "",
    unitOfMeasureID: 0,
    id_AdministrationRoute: 0,
  });
  const [editErrors, setEditErrors] = useState<{
    unitOfMeasureID?: string;
    id_AdministrationRoute?: string;
  }>({});

  // -----------------------------------------------------
  //  ESTADO PARA ELIMINAR
  // -----------------------------------------------------
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<number | null>(null);
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
      unitOfMeasureID: 0,
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
      unitOfMeasureID: newMedication.unitOfMeasureID,
      id_AdministrationRoute: newMedication.id_AdministrationRoute,
      unitOfMeasureName: "",
      routeName: "",
      createdAt: "",
      updatedAt: "",
    });

    closeAddModal();
  };

  // -----------------------------------------------------
  //  FUNCIONES PARA EDITAR (Similar al modal de productos)
  // -----------------------------------------------------
  const openEditModal = (item: MedicationSpecific) => {
    if (!item || typeof item !== "object" || !item.id_MedicamentSpecific) return;
    
    setSelectedMedication(item);
    setEditFormData({
      medicationName: item.name_MedicamentSpecific,
      medicationDescription: item.specialInstructions || "",
      administrationSchedule: item.administrationSchedule || "",
      unitOfMeasureID: item.unitOfMeasureID || 0,
      id_AdministrationRoute: item.id_AdministrationRoute || 0,
    });
    setIsEditingMode(false); // Siempre inicia en modo preview
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedMedication(null);
    setEditFormData({
      medicationName: "",
      medicationDescription: "",
      administrationSchedule: "",
      unitOfMeasureID: 0,
      id_AdministrationRoute: 0,
    });
    setIsEditingMode(false);
    setEditErrors({});
    setIsEditModalOpen(false);
  };

  const toggleEditMode = () => {
    setIsEditingMode(!isEditingMode);
    setEditErrors({});
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'unitOfMeasureID' || name === 'id_AdministrationRoute' ? parseInt(value, 10) : value
    }));
  };

  const handleSaveEdit = () => {
    if (!selectedMedication) return;

    // Validaciones
    const newErrors: { unitOfMeasureID?: string; id_AdministrationRoute?: string } = {};
    if (!editFormData.unitOfMeasureID) newErrors.unitOfMeasureID = 'Selecciona una unidad de medida';
    if (!editFormData.id_AdministrationRoute) newErrors.id_AdministrationRoute = 'Selecciona una vía de administración';

    if (Object.keys(newErrors).length) {
      setEditErrors(newErrors);
      return;
    }

    updateEntity.mutate(
      {
        id: selectedMedication.id_MedicamentSpecific,
        name_MedicamentSpecific: editFormData.medicationName,
        specialInstructions: editFormData.medicationDescription,
        administrationSchedule: editFormData.administrationSchedule,
        unitOfMeasureID: editFormData.unitOfMeasureID,
        id_AdministrationRoute: editFormData.id_AdministrationRoute,
        updatedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setIsEditingMode(false);
          closeEditModal();
        },
      }
    );
  };

  // -----------------------------------------------------
  //  FUNCIONES PARA ELIMINAR
  // -----------------------------------------------------
  const openConfirmDeleteModal = (item: MedicationSpecific) => {
    if (!item || typeof item !== "object" || !item.id_MedicamentSpecific) return;
    
    setMedicationToDelete(item.id_MedicamentSpecific);
    setMedicationNameToDelete(item.name_MedicamentSpecific ?? "este medicamento");
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

  // Función para obtener el nombre de la unidad de medida
  const getUnitOfMeasureName = (unitId: number) => {
    const unit = units?.find(u => u.unitOfMeasureID === unitId);
    return unit ? unit.nombreUnidad : "Unidad no encontrada";
  };

  // Función para obtener el nombre de la ruta de administración
  const getRouteName = (routeId: number) => {
    const route = routes?.find(r => r.id_AdministrationRoute === routeId);
    return route ? route.routeName : "Ruta no encontrada";
  };

  // -----------------------------------------------------
  //  RENDER
  // -----------------------------------------------------
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center flex-1">Gestión de medicamentos</h2>
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

      {/* Si hay mensaje de éxito/error */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Tabla principal */}
      <AdminTable
        title="Lista de Medicamentos Específicos"
        columns={[
          { key: "name_MedicamentSpecific", label: "Nombre" },
          { key: "specialInstructions", label: "Instrucciones" },
          { key: "routeName", label: "Ruta de administración" },
          { key: "unitOfMeasureName", label: "Unidad de medida" },
        ]}
        data={medicationSpecificList?.data || []}
        isLoading={isLoading}
        onAdd={openAddModal}
        onEdit={(item: MedicationSpecific) => openEditModal(item)}
        onDelete={(id: number) => {
          const item = medicationSpecificList?.data?.find((med: MedicationSpecific) => med.id_MedicamentSpecific === id);
          if (item) openConfirmDeleteModal(item);
        }}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
        onPreviousPage={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
        itemsPerPage={pageSize}
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
            value={newMedication.unitOfMeasureID}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                unitOfMeasureID: parseInt(e.target.value, 10),
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

      {/* Modal para Editar/Preview (Similar al modal de productos) */}
      {isEditModalOpen && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditingMode ? "Editar Medicamento" : "Detalles del Medicamento"}
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* ID (Solo lectura - solo se muestra en modo preview) */}
                {!isEditingMode && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ID:</label>
                    <input
                      type="text"
                      value={selectedMedication.id_MedicamentSpecific}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                )}
                
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre:</label>
                  <input
                    type="text"
                    name="medicationName"
                    value={editFormData.medicationName}
                    onChange={handleEditFormChange}
                    readOnly={!isEditingMode}
                    className={`w-full p-2 border rounded-lg ${
                      !isEditingMode 
                        ? 'bg-gray-100 cursor-not-allowed border-gray-300' 
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                
                {/* Instrucciones especiales */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Instrucciones especiales:</label>
                  <textarea
                    name="medicationDescription"
                    value={editFormData.medicationDescription}
                    onChange={handleEditFormChange}
                    readOnly={!isEditingMode}
                    rows={3}
                    className={`w-full p-2 border rounded-lg ${
                      !isEditingMode 
                        ? 'bg-gray-100 cursor-not-allowed border-gray-300' 
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                    placeholder="Instrucciones especiales..."
                  />
                </div>
                
                {/* Horario de administración */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Horario de administración:</label>
                  <input
                    type="text"
                    name="administrationSchedule"
                    value={editFormData.administrationSchedule}
                    onChange={handleEditFormChange}
                    readOnly={!isEditingMode}
                    className={`w-full p-2 border rounded-lg ${
                      !isEditingMode 
                        ? 'bg-gray-100 cursor-not-allowed border-gray-300' 
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                    placeholder="Horario de administración..."
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Ruta de administración */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ruta de administración:</label>
                  {isEditingMode ? (
                    <select
                      name="id_AdministrationRoute"
                      value={editFormData.id_AdministrationRoute}
                      onChange={handleEditFormChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        editErrors.id_AdministrationRoute ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value={0}>Seleccione una ruta de administración</option>
                      {routes?.map((r) => (
                        <option key={r.id_AdministrationRoute} value={r.id_AdministrationRoute}>
                          {r.routeName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={getRouteName(editFormData.id_AdministrationRoute)}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  )}
                  {editErrors.id_AdministrationRoute && (
                    <p className="text-red-500 text-sm mt-1">{editErrors.id_AdministrationRoute}</p>
                  )}
                </div>
                
                {/* Unidad de medida */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unidad de medida:</label>
                  {isEditingMode ? (
                    <select
                      name="unitOfMeasureID"
                      value={editFormData.unitOfMeasureID}
                      onChange={handleEditFormChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        editErrors.unitOfMeasureID ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value={0}>Seleccione una unidad de medida</option>
                      {units?.map((u) => (
                        <option key={u.unitOfMeasureID} value={u.unitOfMeasureID}>
                          {u.nombreUnidad}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={getUnitOfMeasureName(editFormData.unitOfMeasureID)}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  )}                  {editErrors.unitOfMeasureID && (
                    <p className="text-red-500 text-sm mt-1">{editErrors.unitOfMeasureID}</p>
                  )}
                </div>
                  {/* Fechas - Solo se muestran en modo preview */}
                {!isEditingMode && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de creación:</label>
                      <input
                        type="text"
                        value={selectedMedication.createdAt ? new Date(selectedMedication.createdAt).toLocaleString() : "No especificada"}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Última actualización:</label>
                      <input
                        type="text"
                        value={selectedMedication.updatedAt ? new Date(selectedMedication.updatedAt).toLocaleString() : "Nunca actualizado"}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Botones */}
            <div className="mt-6 flex justify-end space-x-4">
              {isEditingMode ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    disabled={updateEntity.isLoading}
                  >
                    {updateEntity.isLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleEditMode}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={closeEditModal}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cerrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar */}
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
