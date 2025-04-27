import React, { useState } from 'react';
import Modal from 'react-modal';
import { formatDate, formatLongDate, formatTime } from '../../utils/formatDate';
import Toast from '../common/Toast';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import EditAppointmentModal from './EditAppointmentModal';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  // Obtener el rol del usuario
  const { selectedRole } = useAuth();
  const { showToast, message, type } = useToast();

  // Abre el modal de edición SOLO si el rol es "Enfermeria"
  const handleOpenEditModal = (appointment: any) => {
    if (selectedRole !== 'Enfermeria') {
      showToast('No tienes permiso para editar citas.', 'warning');
      return;
    }

    setSelectedAppointment(appointment);
    setEditModalIsOpen(true);
  };

  // Cuando se actualiza una cita exitosamente
  const handleAppointmentUpdated = (updatedAppointment: any) => {
    // Actualizar la cita en el arreglo local para reflejar cambios inmediatamente
    if (updatedAppointment) {
      setDailyAppointments(prev => 
        prev.map(appt => 
          appt.id_Appointment === updatedAppointment.id_Appointment
            ? updatedAppointment
            : appt
        )
      );
      
      // Si es la cita actual que se está mostrando, actualizarla también
      if (currentAppointment?.id_Appointment === updatedAppointment.id_Appointment) {
        setSelectedAppointment(updatedAppointment);
      }
      
      // Mostrar mensaje de éxito
      showToast('Cita actualizada exitosamente', 'success');
    }
    
    // Refrescar los datos en el backend
    onSave();
  };

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
      {/* Toast global fuera de los modales */}
      <Toast message={message} type={type} />
      
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

      {/* Modal de edición separado como componente independiente */}
      {selectedAppointment && (
        <EditAppointmentModal
          isOpen={editModalIsOpen}
          onRequestClose={() => setEditModalIsOpen(false)}
          appointment={selectedAppointment}
          onSave={handleAppointmentUpdated}
        />
      )}
    </>
  );
};

export default DailyAppointment;
