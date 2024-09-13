import { useState } from 'react';
import { useVolunteerRequests } from '../../hooks/useVolunteerRequests';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useFilteredRequests } from '../../hooks/useFilteredRequests';
import { VolunteerRequest } from '../../types/VolunteerType';

function VolunteerRequests() {
  const { data: volunteerRequests = [], error } = useVolunteerRequests(); // Asegúrate de acceder a `data`
  const { isDarkMode } = useThemeDark();
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Aceptada' | 'Rechazada' | 'Pendiente' | 'Todas'>('Todas');
  const [filterType, setFilterType] = useState<string>('Todas');

  // Usar el hook de filtrado
  const filteredRequests = useFilteredRequests(volunteerRequests, filterStatus, filterType);

  if (error) {
    return <div>Error loading volunteer requests</div>;
  }

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Solicitudes de Voluntarios
      </h2>

      {/* Filtros */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <button className={`px-4 py-2 rounded ${filterStatus === 'Aceptada' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setFilterStatus('Aceptada')}>Aceptadas</button>
          <button className={`px-4 py-2 rounded ${filterStatus === 'Rechazada' ? 'bg-red-500 text-white' : 'bg-gray-300'}`} onClick={() => setFilterStatus('Rechazada')}>Rechazadas</button>
          <button className={`px-4 py-2 rounded ${filterStatus === 'Pendiente' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`} onClick={() => setFilterStatus('Pendiente')}>Pendientes</button>
          <button className="px-4 py-2 rounded bg-gray-300" onClick={() => setFilterStatus('Todas')}>Todas</button>
        </div>

        <select className="px-4 py-2 border rounded" onChange={(e) => setFilterType(e.target.value)}>
          <option value="Todas">Tipos de Voluntariado</option>
          <option value="Eventual">Eventual</option>
          <option value="Profesional">Profesional</option>
          <option value="Apoyo Directo">Apoyo Directo</option>
        </select>
      </div>

      {/* Tabla */}
      <table className="min-w-full bg-transparent">
        <thead>
          <tr className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <th>#</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request, index) => (
            <tr key={request.id_FormVoluntarie} className={`${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'}`}>
              <td>{index + 1}</td>
              <td onClick={() => setSelectedVolunteer(request)}>{request.vn_Name} {request.vn_Lastname1} {request.vn_Lastname2}</td>
              <td>{request.name_voluntarieType}</td>
              <td>{new Date(request.delivery_Date).toLocaleDateString()}</td>
              <td>{new Date(request.end_Date).toLocaleDateString()}</td>
              <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVolunteer && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
            <button className="absolute top-2 right-2 text-xl text-gray-600" onClick={() => setSelectedVolunteer(null)}>
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">
              {selectedVolunteer.vn_Name} {selectedVolunteer.vn_Lastname1} {selectedVolunteer.vn_Lastname2}
            </h3>
            <p><strong>Email:</strong> {selectedVolunteer.vn_Email}</p>
            <p><strong>Teléfono:</strong> {selectedVolunteer.vn_Phone}</p>
            <p><strong>Fecha de Inicio:</strong> {new Date(selectedVolunteer.delivery_Date).toLocaleDateString()}</p>
            <p><strong>Fecha de Fin:</strong> {new Date(selectedVolunteer.end_Date).toLocaleDateString()}</p>
            <p><strong>Tipo de Voluntario:</strong> {selectedVolunteer.name_voluntarieType}</p>
            <p><strong>Estatus:</strong> {selectedVolunteer.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerRequests;
