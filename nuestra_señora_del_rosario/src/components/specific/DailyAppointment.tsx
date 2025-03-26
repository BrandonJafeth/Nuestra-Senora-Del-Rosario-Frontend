import React, { useState } from 'react';
import Modal from 'react-modal';
import { AppointmentUpdateDto } from '../../types/AppointmentType';
import { useUpdateAppointment } from '../../hooks/useUpdateAppointment';
import { formatDate, formatLongDate, formatTime } from '../../utils/formatDate';
import { EmployeeType } from '../../types/EmployeeType';
import { useToast } from '../../hooks/useToast';
import { useAppointmentStatuses } from '../../hooks/useappointmentStatus';
import Toast from '../common/Toast';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useEmployeesByProfession } from '../../hooks/useEmployeeByProfession';
import { useAuth } from '../../hooks/useAuth'; // <-- Importa el hook de autenticación

interface DailyAppointmentsModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: (open: boolean) => void;
  selectedDate: Date | null;
  dailyAppointments: any[];
  setDailyAppointments: React.Dispatch<React.SetStateAction<any[]>>;
  isDarkMode: boolean;
  onSave: () => void;
}

const DailyAppointment: React.FC<DailyAppointmentsModalProps> = ({
  modalIsOpen,
  setModalIsOpen,
  selectedDate,
  dailyAppointments,
  setDailyAppointments,
  isDarkMode,
  onSave,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la cita actual
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [formData, setFormData] = useState<AppointmentUpdateDto | null>(null);
  const [originalData, setOriginalData] = useState<AppointmentUpdateDto | null>(null);

  // Obtener el rol del usuario
  const { selectedRole } = useAuth();

  // Estados y acompañantes
  const { data: statusesResponse, error: statusesError } = useAppointmentStatuses();
  const { data: companionsResponse } = useEmployeesByProfession(5); // Profesión ID=5 para acompañantes

  const statuses = statusesResponse || [];
  const companions: EmployeeType[] = companionsResponse || [];

  // Hook para actualizar la cita
  const { mutate: updateAppointment, isLoading: updating } = useUpdateAppointment();
  const { showToast, message, type } = useToast();

  // Abre el modal de edición SOLO si el rol es "Enfermeria"
  const handleOpenEditModal = (appointment: any) => {
    if (selectedRole !== 'Enfermeria') {
      showToast('No tienes permiso para editar citas.', 'warning');
      return;
    }
  
    const isoDate = new Date(appointment.date).toISOString().split('T')[0];
    const parsedTime = appointment.time; // e.g. "08:25"
  
    const initialData: AppointmentUpdateDto = {
      id_Appointment: appointment.id_Appointment,
      date: isoDate,
      time: parsedTime,
      // Si vienen como number o string, parsea si hace falta:
      id_Companion: appointment.id_Companion ?? '', 
      id_StatusAP: appointment.id_StatusAP ?? '',
      notes: appointment.notes || '',
    };
  
    setSelectedAppointment(appointment);
    setFormData(initialData);
    setOriginalData(initialData);
    setEditModalIsOpen(true);
  };
  
  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Determina qué campos cambiaron para enviar al backend
  const getUpdatedFields = (original: AppointmentUpdateDto, updated: AppointmentUpdateDto) => {
    const changes: Partial<AppointmentUpdateDto> = {};
    for (const key in updated) {
      const originalValue = original[key as keyof AppointmentUpdateDto];
      const updatedValue = updated[key as keyof AppointmentUpdateDto];
      if (updatedValue !== originalValue) {
        (changes as any)[key] = updatedValue;
      }
    }
    return changes;
  };

  // Envía la actualización al backend
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData && originalData) {
      const changes = getUpdatedFields(originalData, formData);
      if (Object.keys(changes).length === 0) {
        showToast('No se detectaron cambios.', 'warning');
        return;
      }
      updateAppointment(
        { id: formData.id_Appointment, data: formData },
        {
          onSuccess: (updatedAppointment) => {
            // Actualiza el arreglo local de citas
            setDailyAppointments((prev) =>
              prev.map((appt) =>
                appt.id_Appointment === updatedAppointment.id_Appointment
                  ? { ...appt, ...updatedAppointment }
                  : appt
              )
            );
            showToast('¡Cita actualizada con éxito!', 'success');
            setEditModalIsOpen(false);
            onSave(); // Vuelve a refrescar las citas en el componente padre
          },
          onError: (error) => {
            console.error('Error al actualizar la cita:', error);
            showToast('Hubo un problema al actualizar la cita.', 'error');
          },
        }
      );
    }
  };

  if (statusesError) return <p>Error al cargar los estados. Inténtalo de nuevo más tarde.</p>;

  // Paginación de las citas diarias
  const handleNextAppointment = () => {
    if (currentIndex < dailyAppointments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousAppointment = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentAppointment = dailyAppointments[currentIndex];

  return (
    <>

      {/* Modal principal: lista de citas del día */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Citas del día"
        className={`p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 ${
          isDarkMode ? 'bg-[#1f2937] text-white' : 'bg-white text-gray-800'
        }`}
        overlayClassName={`fixed inset-0 ${
          isDarkMode ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'
        } z-50 flex items-center justify-center`}
      >
        <h2 className="text-xl font-bold mb-4">
          Citas del {selectedDate ? formatLongDate(selectedDate.toISOString()) : ''}
        </h2>
        {currentAppointment ? (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg shadow ${
                isDarkMode ? 'bg-[#374151] text-white' : 'bg-gray-100 text-gray-800'
              } ${
                selectedRole === 'Enfermeria' ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              onClick={
                selectedRole === 'Enfermeria'
                  ? () => handleOpenEditModal(currentAppointment)
                  : undefined
              }
            >
              <p className="font-semibold">Residente: {currentAppointment.residentFullName}</p>
              <p>Fecha: {formatDate(currentAppointment.date)}</p>
              <p>Hora: {formatTime(currentAppointment.time)}</p>
              <p>Acompañante: {currentAppointment.companionName}</p>
              <p>Especialidad: {currentAppointment.specialtyName}</p>
              <p>Centro: {currentAppointment.healthcareCenterName}</p>
              <p>Estado: {currentAppointment.statusName}</p>
            </div>

            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={handlePreviousAppointment}
                disabled={currentIndex === 0}
                className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
              >
                <FaArrowLeft />
              </button>

              <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Cita {currentIndex + 1} de {dailyAppointments.length}
              </span>

              <button
                onClick={handleNextAppointment}
                disabled={currentIndex === dailyAppointments.length - 1}
                className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        ) : (
          <p>No hay citas programadas para este día.</p>
        )}

        <button
          onClick={() => setModalIsOpen(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar
        </button>
      </Modal>

      {/* Modal secundario: edición de cita */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={() => setEditModalIsOpen(false)}
        contentLabel="Editar Cita"
        className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
      <Toast message={message} type={type} />
        {formData && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold text-center mb-6">Editar Cita</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Residente (solo lectura) */}
              <div>
                <label>Residente:</label>
                <input
                  type="text"
                  value={selectedAppointment?.residentFullName || ''}
                  disabled
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
                />
              </div>

              {/* Fecha */}
              <div>
                <label>Fecha:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              {/* Hora */}
              <div>
                <label>Hora:</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              {/* Estado */}
              <div>
                <label>Estado:</label>
                <select
                  name="id_StatusAP"
                  value={formData.id_StatusAP}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Selecciona un estado</option>
                  {statuses.map((status) => (
                    <option key={status.id_StatusAP} value={status.id_StatusAP}>
                      {status.name_StatusAP}
                    </option>
                  ))}
                </select>
              </div>

              {/* Acompañante */}
              <div>
                <label>Acompañante:</label>
                <select
                  name="id_Companion"
                  value={formData.id_Companion}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Selecciona un acompañante</option>
                  {companions.map((comp) => (
                    <option key={comp.id_Employee} value={comp.id_Employee}>
                      {comp.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notas */}
              <div className="col-span-2">
                <label>Notas:</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-3 border rounded-lg resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                type="submit"
                disabled={updating}
                className={`px-4 py-2 rounded-lg ${
                  updating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
                tabIndex={0}
              >
                Guardar
              </button>
              <button
                onClick={() => setEditModalIsOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                tabIndex={1}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default DailyAppointment;
