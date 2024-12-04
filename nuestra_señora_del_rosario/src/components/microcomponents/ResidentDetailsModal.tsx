import React from 'react';

interface ResidentDetailsModalProps {
  isOpen: boolean;
  resident: any;
  isEditing: boolean;
  isUpdating: boolean;
  idRoom: number | '';
  idDependencyLevel: number | '';
  status: string;
  rooms: any[];
  dependencyLevels: any[];
  formatDate: (dateString: string) => string;
  onClose: () => void;
  onEdit: () => void;
  onUpdate: () => void;
  setIdRoom: (value: number | '') => void;
  setIdDependencyLevel: (value: number | '') => void;
  setStatus: (value: string) => void;
  isDarkMode: boolean;
}

const ResidentDetailsModal: React.FC<ResidentDetailsModalProps> = ({
  isOpen,
  resident,
  isEditing,
  isUpdating,
  idRoom,
  idDependencyLevel,
  status,
  rooms,
  dependencyLevels,
  formatDate,
  onClose,
  onEdit,
  onUpdate,
  setIdRoom,
  setIdDependencyLevel,
  setStatus,
  isDarkMode,
}) => {
  if (!isOpen || !resident) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`rounded-lg shadow-lg p-8 w-full max-w-4xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
        <h3 className="text-2xl font-bold mb-6">Detalles del Residente</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold">Habitación:</label>
            {isEditing ? (
              <select
                value={idRoom}
                onChange={(e) => setIdRoom(Number(e.target.value))}
                className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              >
                <option value="">Selecciona una habitación</option>
                {rooms.map((room) => (
                  <option key={room.id_Room} value={room.id_Room}>
                    {room.roomNumber}
                  </option>
                ))}
              </select>
            ) : (
              <p className="mt-1 p-2 border rounded-md bg-gray-500 text-white cursor-not-allowed">{resident.roomNumber}</p>
            )}
          </div>

          <div>
            <label className="block font-bold">Grado de Dependencia:</label>
            {isEditing ? (
              <select
                value={idDependencyLevel}
                onChange={(e) => setIdDependencyLevel(Number(e.target.value))}
                className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              >
                <option value="">Selecciona un grado de dependencia</option>
                {dependencyLevels.map((level) => (
                  <option key={level.id_DependencyLevel} value={level.id_DependencyLevel}>
                    {level.levelName}
                  </option>
                ))}
              </select>
            ) : (
              <p className="mt-1 p-2 border rounded-md bg-gray-500 text-white cursor-not-allowed">{resident.dependencyLevel}</p>
            )}
          </div>

          <div>
            <label className="block font-bold">Estado:</label>
            <input
              type="text"
              value={status}
              readOnly={!isEditing}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full p-2 mt-1 border rounded-md ${
                isEditing
                  ? isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200'
                  : 'bg-gray-500 text-white cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className='block font-bold'>Sexo:</label>
            <input type="text" 
            value={resident.sexo}
            readOnly
            className='w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed'
            />
          </div>

          <div>
            <label className="block font-bold">Fecha de Nacimiento:</label>
            <input
              type="text"
              value={formatDate(resident.fechaNacimiento)}
              readOnly
              className="w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed"
            />
          </div>

          <div>
            <label className='block font-bold'>Fecha de entrada</label>
            <input type="text" 
            value={formatDate(resident.entryDate)}
            readOnly
            className='w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed'
            />
          </div>

          <div>
            <label className="block font-bold">Cédula:</label>
            <input type="text" 
            value={resident.cedula_AP}
            className='w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed'
            />
          </div>

          <div>
            <label className="block font-bold">Nombre del Encargado:</label>
            <input
              type="text"
              value={resident.guardianName}
              readOnly
              className="w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold">Teléfono del Encargado:</label>
            <input
              type="text"
              value={resident.guardianPhone}
              readOnly
              className="w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white`}
            tabIndex={1}
          >
            {isEditing ? 'Cancelar' : 'Cerrar'}
          </button>
          {!isEditing ? (
            <button
              onClick={onEdit}
              className={`ml-4 px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              tabIndex={0}
            >
              Editar
            </button>
          ) : (
            <button
              onClick={onUpdate}
              disabled={isUpdating}
              className={`ml-4 px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              tabIndex={0}
            >
              {isUpdating ? 'Guardando...' : 'Guardar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentDetailsModal;
