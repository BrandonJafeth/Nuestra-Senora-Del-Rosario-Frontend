import { useState } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { ApplicationRequest } from '../../types/ApplicationType';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';
import LoadingSpinner from './LoadingSpinner';
import { useCreateResidentfromApplicant } from '../../hooks/useCreateResidentFromApplicant';
import { ResidentPostFromApplicantForm } from '../../types/ResidentsType';

interface CompleteInformationFormProps {
  selectedRequest: ApplicationRequest | null;
  dependencyLevels: Array<{ id_DependencyLevel: number; levelName: string }>;
  rooms: Array<{ id_Room: number; roomNumber: string }>;
  onClose: () => void;
}

const CompleteInformationForm: React.FC<CompleteInformationFormProps> = ({
  selectedRequest,
  dependencyLevels,
  rooms,
  onClose,
}) => {
  const { showToast, message, type } = useToast();
  const { isDarkMode } = useThemeDark();
  const navigate = useNavigate();

  const [dependencyLevel, setDependencyLevel] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [sexo, setSexo] = useState('Masculino');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  // Hook sin react-query
const { createResident, isLoading, error } = useCreateResidentfromApplicant();

  const handleSave = () => {
    if (!selectedRequest) return;

    // Validaciones previas...
    if (!sexo)      return showToast('Por favor, selecciona el sexo.', 'error');
    if (!dependencyLevel) return showToast('Por favor, selecciona el grado de dependencia.', 'error');
    if (!fechaNacimiento) return showToast('Por favor, ingresa la fecha de nacimiento.', 'error');
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() -
      ((today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()))
        ? 1 : 0);
    if (age < 65)   return showToast('La edad debe ser igual o mayor a 65 años.', 'error');
    if (!roomNumber) return showToast('Por favor, selecciona una habitación.', 'error');
    if (!entryDate)  return showToast('Por favor, ingresa la fecha de entrada.', 'error');

    const residentData: ResidentPostFromApplicantForm = {
      id_ApplicationForm: selectedRequest.id_ApplicationForm,
      id_Room: parseInt(roomNumber, 10),
      entryDate: new Date(entryDate).toISOString(),
      sexo,
      fechaNacimiento: birthDate.toISOString(),
      id_DependencyLevel: parseInt(dependencyLevel, 10),
    };

    createResident(residentData)
      .then(() => {
        showToast('Residente creado exitosamente.', 'success');
        setTimeout(onClose, 1500);
        setTimeout(() => navigate('/dashboard/residentes'), 1500);
      })
      .catch((err: any) => {
        showToast(`Ocurrió un error al guardar los datos: ${err.message || err}`, 'error');
      });
  };


  return (
    <>
      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Completar información para {selectedRequest?.name_AP}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold">Sexo</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            >
              <option value="">Seleccionar sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-bold">Grado de dependencia</label>
            <select
              value={dependencyLevel}
              onChange={(e) => setDependencyLevel(e.target.value)}
              className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            >
              <option value="">Seleccionar grado de dependencia</option>
              {dependencyLevels.map((level) => (
                <option key={level.id_DependencyLevel} value={level.id_DependencyLevel}>
                  {level.levelName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-bold">Fecha de nacimiento</label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">Habitación</label>
            <select
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            >
              <option value="">Seleccionar habitación</option>
              {rooms.map((room) => (
                <option key={room.id_Room} value={room.id_Room}>
                  {room.roomNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-bold">Fecha de entrada</label>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isLoading ? <LoadingSpinner /> : 'Guardar'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-2">Error al crear residente.</p>}
      <Toast message={message} type={type} />
    </>
  );
};

export default CompleteInformationForm;
