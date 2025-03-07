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
  onSave: (newAppointment: any) => void; // Cambiar aquí para aceptar un parámetro
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
  const {showToast, message, type} = useToast();
  
  const [loading, setLoading] = useState(false);
  const [healthcareCenterModalOpen, setHealthcareCenterModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    id_Resident: 0,
    date: '',
    time: '',
    id_HC: 0,
    id_Specialty: 0,
    id_Companion: '',
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
  
      // Validar que se haya seleccionado fecha y hora
      if (!formData.date || !formData.time) {
        throw new Error('Por favor, selecciona una fecha y hora válidas.');
      }
  
      // Construir el objeto de la cita con los tipos correctos
      const appointmentData = {
        id_Appointment: 0, // or some default value
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
  
      // Llamar a onSave con los datos de la cita
      await appointmentService.createAppointment(appointmentData);
      onSave(appointmentData); // Pasar el objeto de cita a onSave
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
            Agregar Cita
          </h2>
          <button
            onClick={openHealthcareCenterModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Agregar Centro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Residente:
            </label>
            <ResidentDropdown
  value={formData.id_Resident}
  onChange={(value) => setFormData({ ...formData, id_Resident: value })}
/>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha:
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Centro Médico:
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

          {/* Dropdown de Acompañante */}
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
              {employees?.map((employee : any) => (
                <option key={employee.id_Employee} value={employee.id_Employee}>
                  {employee.fullName}
                </option>
              ))}
            </select>
          </div>

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
      </Modal>

      <AddHealthcareCenterModal
        isOpen={healthcareCenterModalOpen}
        onClose={closeHealthcareCenterModal}
      />
      <Toast message={message} type={type} />
    </>
  );
};

export default AddAppointmentModal;
