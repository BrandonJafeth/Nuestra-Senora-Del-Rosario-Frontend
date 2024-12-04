import { useState } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { ApplicationRequest } from '../../types/ApplicationType';
import { useToast } from '../../hooks/useToast';
import residentsService from '../../services/ResidentsService';
import { useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';

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
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (!selectedRequest) return;

    if (!dependencyLevel || !roomNumber || !entryDate || !sexo) {
      showToast('Por favor completa todos los campos obligatorios.', 'error');
      return;
    }

    const residentData = {
      id_Applicant: selectedRequest.id_Applicant,
      id_Room: parseInt(roomNumber),
      entryDate,
      sexo,
      id_DependencyLevel: parseInt(dependencyLevel),
      guardianName: `${selectedRequest.name_GD} ${selectedRequest.lastname1_GD} ${selectedRequest.lastname2_GD}`,
      status: 'Activo',
    };

    setIsUpdating(true);

    try {
      await residentsService.createResidentFromApplicant(residentData);
      setIsUpdating(false);
      showToast('Residente creado exitosamente', 'success');
      setTimeout(() => onClose(), 2000);
      navigate('/dashboard/residentes');
    } catch (error) {
      setIsUpdating(false);
      console.error('Error al crear el residente:', error);
      showToast('Ocurrió un error al guardar los datos.', 'error');
    }
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
        Completar Información para {selectedRequest?.name_AP}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-bold">Sexo</label>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          >
            <option value="">Seleccionar Sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-bold">Grado de Dependencia</label>
          <select
            value={dependencyLevel}
            onChange={(e) => setDependencyLevel(e.target.value)}
            className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          >
            <option value="">Seleccionar Grado de Dependencia</option>
            {dependencyLevels.map((level) => (
              <option key={level.id_DependencyLevel} value={level.id_DependencyLevel}>
                {level.levelName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-bold">Habitación</label>
          <select
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          >
            <option value="">Seleccionar Habitación</option>
            {rooms.map((room) => (
              <option key={room.id_Room} value={room.id_Room}>
                {room.roomNumber}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-bold">Fecha de Entrada</label>
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
          disabled={isUpdating}
          className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          {isUpdating ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
    <Toast message={message} type={type}/>
    </>
  );
};

export default CompleteInformationForm;
