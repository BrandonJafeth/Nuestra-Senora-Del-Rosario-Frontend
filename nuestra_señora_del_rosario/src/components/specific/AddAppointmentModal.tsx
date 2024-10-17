import { useState } from 'react';
import Modal from 'react-modal';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useResidents } from '../../hooks/useResidents';
import { useHealthcareCenters } from '../../hooks/useHealthcareCenters';
import { useSpeciality } from '../../hooks/useSpeciality';
import { useEmployee } from '../../hooks/useEmployee';
import appointmentService from '../../services/AppointmentService';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import AddHealthcareCenterModal from './AddHealthcareCenterModal';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { isDarkMode } = useThemeDark();
  const { data: residents, isLoading: loadingResidents } = useResidents();
  const { data: healthcareCenters, isLoading: loadingHC } = useHealthcareCenters();
  const { data: specialties, isLoading: loadingSpecialties } = useSpeciality();
  const { data: employees, isLoading: loadingEmployees } = useEmployee();

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
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const appointmentData = {
        id_Resident: Number(formData.id_Resident),
        date: `${formData.date}T${formData.time}:00.000Z`,
        id_HC: Number(formData.id_HC),
        id_Specialty: Number(formData.id_Specialty),
        id_Companion: formData.id_Companion,
        notes: formData.notes || '',
      };

      await appointmentService.createAppointment(appointmentData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al crear la cita:', error);
    } finally {
      setLoading(false);
    }
  };

  const openHealthcareCenterModal = () => {
    setHealthcareCenterModalOpen(true);
  };

  const closeHealthcareCenterModal = () => {
    setHealthcareCenterModalOpen(false);
    onClose();
  };

  if (loadingResidents || loadingHC || loadingSpecialties || loadingEmployees) {
    return <p>Cargando datos...</p>;
  }

  // Estilos Condicionales para Inputs y Selects
  const inputStyles = `w-full p-2 border rounded-lg focus:outline-none ${
    isDarkMode
      ? 'bg-gray-700 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500'
      : 'bg-white border-gray-300 text-black focus:border-blue-500'
  }`;
  const labelStyles = `block text-sm font-medium ${
    isDarkMode ? 'text-white' : 'text-gray-700'
  }`;

  return (
    <>
      <Modal
        isOpen={isOpen && !healthcareCenterModalOpen}
        onRequestClose={onClose}
        contentLabel="Agregar Cita"
        className="custom-modal-content"
        overlayClassName="custom-modal-overlay"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Agregar Cita</h2>
          <button
            onClick={openHealthcareCenterModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Agregar Centro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Residente */}
          <div className="col-span-2">
            <label className={labelStyles}>Residente:</label>
            <select
              name="id_Resident"
              value={formData.id_Resident}
              onChange={handleInputChange}
              className={inputStyles}
            >
              <option value="">Selecciona un residente</option>
              {residents?.map((resident) => (
                <option key={resident.id_Resident} value={resident.id_Resident}>
                  {`${resident.name_AP} ${resident.lastname1_AP} ${resident.lastname2_AP}`}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className={labelStyles}>Fecha:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={inputStyles}
            />
          </div>

          {/* Hora */}
          <div>
            <label className={labelStyles}>Hora:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className={inputStyles}
            />
          </div>

          {/* Centro Médico */}
          <div>
            <label className={labelStyles}>Centro Médico:</label>
            <select
              name="id_HC"
              value={formData.id_HC}
              onChange={handleInputChange}
              className={inputStyles}
            >
              <option value="">Selecciona un centro</option>
              {healthcareCenters?.data.map((hc) => (
                <option key={hc.id_HC} value={hc.id_HC}>
                  {hc.name_HC}
                </option>
              ))}
            </select>
          </div>

          {/* Especialidad */}
          <div>
            <label className={labelStyles}>Especialidad:</label>
            <select
              name="id_Specialty"
              value={formData.id_Specialty}
              onChange={handleInputChange}
              className={inputStyles}
            >
              <option value="">Selecciona una especialidad</option>
              {specialties?.data.map((specialty) => (
                <option key={specialty.id_Specialty} value={specialty.id_Specialty}>
                  {specialty.name_Specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Acompañante */}
          <div className="col-span-2">
            <label className={labelStyles}>Acompañante:</label>
            <select
              name="id_Companion"
              value={formData.id_Companion}
              onChange={handleInputChange}
              className={inputStyles}
            >
              <option value="">Selecciona un acompañante</option>
              {employees?.map((employee) => (
                <option key={employee.dni} value={employee.dni}>
                  {employee.firstName} {employee.lastName1} {employee.lastName2}
                </option>
              ))}
            </select>
          </div>

          {/* Notas */}
          <div className="col-span-2">
            <label className={labelStyles}>Notas:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className={`${inputStyles} resize-none`}
              placeholder="Escribe notas adicionales"
            ></textarea>
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cerrar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 rounded-lg ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? <LoadingSpinner /> : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>

      <AddHealthcareCenterModal
        isOpen={healthcareCenterModalOpen}
        onClose={closeHealthcareCenterModal}
      />
    </>
  );
};

export default AddAppointmentModal;
