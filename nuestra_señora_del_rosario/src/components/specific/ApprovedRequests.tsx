import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useApprovedRequests } from '../../hooks/useApprovedRequests';
import { useDependencyLevel } from '../../hooks/useDependencyLevel';
import { useRoom } from '../../hooks/useRoom';
import { ApplicationRequest } from '../../types/ApplicationType';
import residentsService from '../../services/ResidentsService';
import { useThemeDark } from '../../hooks/useThemeDark';
import Toast from '../common/Toast';
import { useToast } from '../../hooks/useToast';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function ApprovedRequests() {
  const { showToast, message, type } = useToast();
  const { isDarkMode } = useThemeDark();
  const navigate = useNavigate();

  // Paginación
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;
  const { approvedRequests = [], isLoading, error, totalPages } = useApprovedRequests({ page: pageNumber, pageSize });
  
  const { data: rooms = [] } = useRoom();
  const { data: dependencyLevels = [] } = useDependencyLevel();

  const [selectedRequest, setSelectedRequest] = useState<ApplicationRequest | null>(null);
  const [dependencyLevel, setDependencyLevel] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [sexo, setSexo] = useState('Masculino');
  const [isUpdating, setIsUpdating] = useState(false);

  // Paginación: manejar las páginas
  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleSave = async () => {
    if (selectedRequest) {
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
        navigate('/dashboard/residentes');
      } catch (error) {
        setIsUpdating(false);
        console.error('Error al crear el residente:', error);
        showToast('Ocurrió un error al guardar los datos. Verifica la consola para más detalles.', 'error');
      }
    }
  };

  const Navigate = () => {
    navigate('/dashboard/residentes');
  };

  if (isLoading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>Error al cargar las solicitudes aprobadas</div>;
  }

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl mt-10 ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Solicitudes Aprobadas</h2>

      <table className={`min-w-full rounded-lg shadow-md ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
        <thead>
          <tr className={`text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <th className="p-4">Nombre</th>
            <th className="p-4">Primer Apellido</th>
            <th className="p-4">Cédula</th>
            <th className="p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {approvedRequests.map((request: ApplicationRequest) => (
            <tr key={request.id_ApplicationForm} className={`hover:bg-gray-200 text-center ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'}`}>
              <td className="p-4">{request.name_AP}</td>
              <td className="p-4">{request.lastname1_AP}</td>
              <td className="p-4">{request.cedula_AP}</td>
              <td className="p-4">
                <button onClick={() => setSelectedRequest(request)} className={`px-4 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                  Completar Información
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={pageNumber === 1}
          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
        >
          <FaArrowLeft />
        </button>

        <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Página {pageNumber} de {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={pageNumber === totalPages}
          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Formulario para completar la información */}
      {selectedRequest && (
        <form className="mt-8" onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Completar Información para {selectedRequest.name_AP}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-bold">Sexo</label>
              <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
                <option value="">Seleccionar Sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold">Grado de Dependencia</label>
              <select value={dependencyLevel} onChange={(e) => setDependencyLevel(e.target.value)} className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
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
              <select value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
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
              <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`} />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={Navigate} className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white`}>
              Cancelar
            </button>
            <button type="submit" disabled={isUpdating} className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
              {isUpdating ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}
      <Toast message={message} type={type} />
    </div>
  );
}

export default ApprovedRequests;
