import { useState } from 'react';
import { useVolunteerRequests } from '../../hooks/useVolunteerRequests';
import { useThemeDark } from '../../hooks/useThemeDark';
import { VolunteerRequest } from '../../types/VolunteerType';
import { useEditVolunteerStatus } from '../../hooks/useEditVolunteerStatus';

function VolunteerRequests() {
  const { data: volunteerRequests = [], isLoading, error } = useVolunteerRequests();
  const { isDarkMode } = useThemeDark();
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);
  const { updateStatus } = useEditVolunteerStatus(volunteerRequests);

  console.log('volunteerRequests:', volunteerRequests);

  // Verificar si los datos están cargando
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Verificar si hay un error
  if (error) {
    return <div>Error loading volunteer requests</div>;
  }

  // Verificar si no hay datos disponibles
  if (!volunteerRequests.length) {
    return <div>No volunteer requests available</div>;
  }

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Solicitudes de Voluntarios
      </h2>
      
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent rounded-lg shadow-md">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} text-left`}>
              <th className="p-4">#</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Fecha Inicio</th>
              <th className="p-4">Fecha Fin</th>
              <th className="p-4">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {volunteerRequests.map((request, index) => (
              <tr
                key={request.id_FormVoluntarie}
                className={`${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
              >
                <td className="p-4">{index + 1}</td>
                <td
                  className={`p-4 cursor-pointer ${request.status_Name === 'Rechazada' ? 'text-red-500' : 'text-gray-900'}`}
                  onClick={() => setSelectedVolunteer(request)}
                >
                  {`${request.vn_Name} ${request.vn_Lastname1} ${request.vn_Lastname2}`}
                </td>
                <td className="p-4">{request.name_voluntarieType}</td>
                <td className="p-4">{new Date(request.delivery_Date).toLocaleDateString()}</td>
                <td className="p-4">{new Date(request.end_Date).toLocaleDateString()}</td>
                <td className="p-4">
                  <select
                    value={request.status_Name}
                    onChange={(e) => updateStatus(request.id_FormVoluntarie, e.target.value as 'Aceptada' | 'Rechazada' | 'Pendiente')}
                    className={`px-3 py-2 rounded-xl ${
                      request.status_Name === 'Pendiente'
                        ? 'bg-gray-400 text-black'
                        : request.status_Name === 'Aceptada'
                        ? 'bg-green-500 text-white'
                        : request.status_Name === 'Rechazada'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aceptada">Aceptada</option>
                    <option value="Rechazada">Rechazada</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedVolunteer && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-12 rounded-lg shadow-lg relative w-[600px]">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
              onClick={() => setSelectedVolunteer(null)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">
              {selectedVolunteer.vn_Name} {selectedVolunteer.vn_Lastname1} {selectedVolunteer.vn_Lastname2}
            </h3>
            <div className="text-lg">
              <p><strong>Email:</strong> {selectedVolunteer.vn_Email}</p>
              <p><strong>Teléfono:</strong> {selectedVolunteer.vn_Phone}</p>
              <p><strong>Fecha de Inicio:</strong> {new Date(selectedVolunteer.delivery_Date).toLocaleDateString()}</p>
              <p><strong>Fecha de Fin:</strong> {new Date(selectedVolunteer.end_Date).toLocaleDateString()}</p>
              <p><strong>Tipo de Voluntario:</strong> {selectedVolunteer.name_voluntarieType}</p>
              <p><strong>Estatus:</strong> {selectedVolunteer.status_Name}</p>
            </div>
            <div className="text-center mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setSelectedVolunteer(null)}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerRequests;
