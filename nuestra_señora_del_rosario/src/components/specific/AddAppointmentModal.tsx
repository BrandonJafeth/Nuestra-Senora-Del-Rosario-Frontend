import { useState } from 'react';
import Modal from 'react-modal';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useResidents } from '../../hooks/useResidents';
import { useHealthcareCenters } from '../../hooks/useHealthcareCenters';
import { useSpeciality } from '../../hooks/useSpeciality';
import { useEmployee } from '../../hooks/useEmployee';
import appointmentService from '../../services/AppointmentService';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { set } from 'date-fns';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // Refetch de citas al guardar correctamente
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
  const [loading, setLoading] = useState(false); // Estado de carga del botón

  const [formData, setFormData] = useState({
    id_Resident: 0, // Debe ser un número
    date: '', // Formato ISO
    time: '', // "HH:mm"
    id_HC: 0, // Número
    id_Specialty: 0, // Número
    id_Companion: '', // Opcional
    notes: undefined, // String opcional
  });
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      // 
      setLoading(true); 
      const appointmentData = {
        id_Resident: Number(formData.id_Resident),
        date: `${formData.date}T${formData.time}:00.000Z`, // Combinar fecha y hora en formato ISO
        id_HC: Number(formData.id_HC),
        id_Specialty: Number(formData.id_Specialty),
        id_Companion: formData.id_Companion,
        notes: formData.notes || '', // Si está vacío, enviar string vacío
      };
  
      await appointmentService.createAppointment(appointmentData); // Enviar datos al servicio
      onSave(); // Refetch de citas
      onClose(); // Cerrar modal
    } catch (error) {
      console.error('Error al crear la cita:', error);
    } finally {
    setLoading(false); 
    }
  };
  

  if (loadingResidents || loadingHC || loadingSpecialties || loadingEmployees) {
    return <p>Cargando datos...</p>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Agregar Cita"
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full mx-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
        Agregar Nueva Cita
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dropdown de Residentes */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Residente:
          </label>
          <select
            name="id_Resident"
            value={formData.id_Resident}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fecha:
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            className="mt-1 block w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Centro Médico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Centro Médico:
          </label>
          <select
            name="id_HC"
            value={formData.id_HC}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Especialidad:
          </label>
          <select
            name="id_Specialty"
            value={formData.id_Specialty}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Acompañante:
          </label>
          <select
            name="id_Companion"
            value={formData.id_Companion}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notas:
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            disabled={loading} // Deshabilitar mientras se carga
            className={`px-4 py-2 rounded-lg ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? <LoadingSpinner /> : 'Guardar'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddAppointmentModal;
