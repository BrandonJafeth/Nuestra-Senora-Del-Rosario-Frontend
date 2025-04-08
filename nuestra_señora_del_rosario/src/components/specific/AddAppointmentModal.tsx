import { useState } from 'react';
import Modal from 'react-modal';
import { useHealthcareCenters } from '../../hooks/useHealthcareCenters';
import { useSpeciality } from '../../hooks/useSpeciality';
import appointmentService from '../../services/AppointmentService';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import AddHealthcareCenterModal from './AddHealthcareCenterModal';
import ResidentDropdown from '../microcomponents/ResidentDropdown';
import { useAllResidents } from '../../hooks/useAllResidents';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import { useEmployeesByProfession } from '../../hooks/useEmployeeByProfession';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAppointment: any) => void;
  residents: any[];
  healthcareCenters: any[];
  specialties: any[];
  companions: any[];
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { isLoading: loadingResidents } = useAllResidents();
  const { data: healthcareCenters, isLoading: loadingHC } = useHealthcareCenters();
  const { data: specialties, isLoading: loadingSpecialties } = useSpeciality();
  const { data: employees, isLoading: loadingEmployees } = useEmployeesByProfession([5]);
  
  const { showToast, message, type } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [healthcareCenterModalOpen, setHealthcareCenterModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    id_Resident: 0,
    date: '',
    time: '',
    id_HC: 0,
    id_Specialty: 0,
    id_Companion: '', // Si es requerido, conviene validar
    notes: undefined,
    residentFullName: '',
    residentCedula: '',
    specialtyName: '',
    healthcareCenterName: '',
    companionName: '',
    statusName: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validar campos requeridos:
      if (
        !formData.id_Resident ||
        !formData.date ||
        !formData.time ||
        !formData.id_HC ||
        !formData.id_Specialty ||
        !formData.id_Companion
      ) {
        showToast('Por favor, completa todos los campos requeridos.', 'error');
        setLoading(false);
        return;
      }

      // Validar que fecha y hora no sean anteriores a la actual (opcional):
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      if (selectedDateTime < new Date()) {
        showToast('La fecha y hora seleccionadas ya pasaron.', 'error');
        setLoading(false);
        return;
      }

      // Construir el objeto de la cita
      const appointmentData = {
        id_Appointment: 0,
        id_Resident: Number(formData.id_Resident),
        date: formData.date,
        time: formData.time + ':00',
        id_HC: Number(formData.id_HC),
        id_Specialty: Number(formData.id_Specialty),
        id_Companion: Number(formData.id_Companion),
        notes: formData.notes || '',
        residentFullName: '',
        residentCedula: '',
        specialtyName: '',
        healthcareCenterName: '',
        companionName: '',
        statusName: ''
      };

      // Guardar en el backend
      await appointmentService.createAppointment(appointmentData);
      
      // Notificar al componente padre y mostrar toast
      onSave(appointmentData);
      showToast('Cita creada exitosamente', 'success');
      
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      showToast('Error al crear la cita.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openHealthcareCenterModal = () => setHealthcareCenterModalOpen(true);
  const closeHealthcareCenterModal = () => setHealthcareCenterModalOpen(false);

  if (loadingResidents || loadingHC || loadingSpecialties || loadingEmployees) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Modal
        isOpen={isOpen && !healthcareCenterModalOpen}
        onRequestClose={onClose}
        contentLabel="Agregar Cita"
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full mx-auto"
        overlayClassName="custom-modal-overlay"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Agregar cita
          </h2>
          <button
            onClick={openHealthcareCenterModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Agregar centro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Residente */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Residente:
            </label>
            <ResidentDropdown
              value={formData.id_Resident}
              onChange={(value) => setFormData({ ...formData, id_Resident: value })}
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha:
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              min={new Date().toISOString().split('T')[0]} // Establecer la fecha mínima como hoy
              onChange={handleInputChange}
              className={`w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                formData.date && new Date(formData.date) < new Date() ? 'bg-red-500 text-white' : ''
              }`}
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hora:
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Centro Médico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Centro médico:
            </label>
            <select
              name="id_HC"
              value={formData.id_HC}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecciona un centro</option>
              {healthcareCenters?.map((hc) => (
                <option key={hc.id_HC} value={hc.id_HC}>
                  {hc.name_HC}
                </option>
              ))}
            </select>
          </div>

          {/* Especialidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Especialidad:
            </label>
            <select
              name="id_Specialty"
              value={formData.id_Specialty}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecciona una especialidad</option>
              {specialties?.map((specialty) => (
                <option key={specialty.id_Specialty} value={specialty.id_Specialty}>
                  {specialty.name_Specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Acompañante */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Acompañante:
            </label>
            <select
              name="id_Companion"
              value={formData.id_Companion}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecciona un acompañante</option>
              {employees?.map((employee: any) => (
                <option key={employee.id_Employee} value={employee.id_Employee}>
                  {employee.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Notas */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notas:
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              placeholder="Escribe notas adicionales"
            ></textarea>
          </div>

          <div className="col-span-2 flex justify-end mt-6 space-x-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 rounded-lg ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? <LoadingSpinner /> : 'Guardar'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancelar
            </button>
          </div>
        </div>
        <Toast message={message} type={type} />
      </Modal>

      <AddHealthcareCenterModal
        isOpen={healthcareCenterModalOpen}
        onClose={closeHealthcareCenterModal}
      />
    </>
  );
};

export default AddAppointmentModal;
