import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AppointmentUpdateDto } from '../../types/AppointmentType';
import { useUpdateAppointment } from '../../hooks/useUpdateAppointment';
import { EmployeeType } from '../../types/EmployeeType';
import { useToast } from '../../hooks/useToast';
import { useAppointmentStatuses } from '../../hooks/useappointmentStatus';
import { useEmployeesByProfession } from '../../hooks/useEmployeeByProfession';
import { useThemeDark } from '../../hooks/useThemeDark';
import LoadingSpinner from '../microcomponents/LoadingSpinner';

// Asegurar que Modal esté correctamente configurado para el DOM
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

interface EditAppointmentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  appointment: any; // La cita a editar
  onSave?: (updatedAppointment: any) => void; // Callback con la cita actualizada
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onRequestClose,
  appointment,
  onSave
}) => {
  // Estado para el formulario
  const [formData, setFormData] = useState<AppointmentUpdateDto | null>(null);
  
  // Hooks para obtener datos
  const { isDarkMode } = useThemeDark();
  const { data: statusesResponse, isLoading: loadingStatuses } = useAppointmentStatuses();
  const { data: companionsResponse, isLoading: loadingCompanions } = useEmployeesByProfession(5);
  
  // Hook para actualizar la cita
  const { mutate: updateAppointment, isLoading: updating } = useUpdateAppointment();
  const { showToast } = useToast();
  
  const statuses = statusesResponse || [];
  const companions: EmployeeType[] = companionsResponse || [];

  // Cargar los datos de la cita cuando se abre el modal o cambia la cita
  useEffect(() => {
    if (isOpen && appointment) {
      // Formatear la fecha para el input date (YYYY-MM-DD)
      const isoDate = appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '';
      
      // Obtener la hora de la cita (puede ser HH:MM:SS o HH:MM)
      const parsedTime = appointment.time || '';
      
      // Crear el objeto inicial para el formulario con los valores actuales de la cita
      const initialData: AppointmentUpdateDto = {
        id_Appointment: appointment.id_Appointment,
        date: isoDate,
        time: parsedTime,
        id_Companion: appointment.id_Companion,
        id_StatusAP: appointment.id_StatusAP,
        notes: appointment.notes || '',
      };
      
      setFormData(initialData);
      
      console.log('Datos originales de la cita:', {
        appointment,
        initialData,
        statuses,
        companions
      });
    }
  }, [isOpen, appointment, companionsResponse, statusesResponse]);

  // Manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Enviar el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    // Convertir a números para la API
    const dataToSend = {
      ...formData,
      id_Companion: Number(formData.id_Companion),
      id_StatusAP: Number(formData.id_StatusAP),
    };

    updateAppointment(
      { id: formData.id_Appointment, data: dataToSend },
      {
        onSuccess: () => {
          // Crear un objeto con la cita actualizada para la UI
          const updatedAppointment = {
            ...appointment,
            ...dataToSend,
            // Actualizar los nombres mostrados
            companionName: companions.find(c => c.id_Employee === Number(formData.id_Companion))?.fullName || 'Sin asignar',
            statusName: statuses.find(s => s.id_StatusAP === Number(formData.id_StatusAP))?.name_StatusAP || 'Sin estado',
            date: formData.date,
            time: formData.time,
            notes: formData.notes
          };
          
          showToast('¡Cita actualizada con éxito!', 'success');
          onRequestClose();
          
          // Notificar al componente padre con la cita actualizada
          if (onSave) onSave(updatedAppointment);
        },
        onError: (error) => {
          console.error('Error al actualizar la cita:', error);
          showToast('Hubo un problema al actualizar la cita.', 'error');
        },
      }
    );
  };

  // No mostrar el formulario hasta que se carguen todos los datos necesarios
  const isLoading = loadingStatuses || loadingCompanions || !formData;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar Cita"
      className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-8 rounded-lg shadow-lg max-w-lg w-full mx-auto`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 900
        },
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          border: 'none',
          background: isDarkMode ? '#1F2937' : '#FFFFFF',
          padding: '20px',
          borderRadius: '8px'
        }
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-center mb-6">Editar Cita</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Residente (solo lectura) */}
            <div>
              <label className="block text-sm font-medium mb-1">Residente:</label>
              <input
                type="text"
                value={appointment?.residentFullName || ''}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-100"
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium mb-1">Fecha:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium mb-1">Hora:</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium mb-1">Estado:</label>
              <select
                name="id_StatusAP"
                value={formData.id_StatusAP}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Selecciona un estado</option>
                {statuses.map((status) => (
                  <option key={status.id_StatusAP} value={status.id_StatusAP}>
                    {status.name_StatusAP}
                  </option>
                ))}
              </select>
            </div>

            {/* Especialidad (solo lectura) */}
            <div>
              <label className="block text-sm font-medium mb-1">Especialidad:</label>
              <input
                type="text"
                value={appointment?.specialtyName || ''}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-100"
              />
            </div>

            {/* Centro médico (solo lectura) */}
            <div>
              <label className="block text-sm font-medium mb-1">Centro médico:</label>
              <input
                type="text"
                value={appointment?.healthcareCenterName || ''}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-100"
              />
            </div>

            {/* Acompañante */}
            <div>
              <label className="block text-sm font-medium mb-1">Acompañante:</label>
              <select
                name="id_Companion"
                value={formData.id_Companion}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <label className="block text-sm font-medium mb-1">Notas:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              ></textarea>
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
              {updating ? <LoadingSpinner /> : 'Guardar'}
            </button>
            <button
              onClick={onRequestClose}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              tabIndex={1}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditAppointmentModal;