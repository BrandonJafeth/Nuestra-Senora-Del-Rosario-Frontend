import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useApplicationRequests } from '../../hooks/useApplication';
import InsertRequestForm from './insertRequestForm';

function ApprovedRequest() {
  const { data: applicationRequests = [], isLoading, error } = useApplicationRequests();
  const [showInsertForm, setShowInsertForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  const handleAddRequest = () => {
    setShowInsertForm(true);
  };

  const handleRequestAdded = () => {
    setShowInsertForm(false); // Ocultamos el formulario cuando se haya añadido la solicitud
  };

  // Filtramos solo las solicitudes aprobadas
  const approvedRequests = applicationRequests.filter(
    (request: any) =>
      request.status_Name === 'Approved' &&
      (request.name_AP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.lastname1_AP.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (showInsertForm) {
    return <InsertRequestForm onRequestAdded={handleRequestAdded} onClose={() => setShowInsertForm(false)} />;
  }

  if (error) {
    return <div>Error al cargar las solicitudes aprobadas</div>;
  }

  return (
    <div className="w-full max-w-[1169px] mx-auto p-6 bg-white rounded-[20px] shadow-2xl">
      {/* Título y Botón */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-center">Solicitudes Aprobadas</h2>
        <button
          onClick={handleAddRequest}
          className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition duration-200"
        >
          Añadir Solicitud
        </button>
      </div>

      {/* Filtro de búsqueda */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
          className="w-full max-w-md p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Cargando */}
      {isLoading ? (
        <Skeleton count={5} />
      ) : (
        <div className="flex justify-center">
          <table className="min-w-full max-w-5xl bg-transparent rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-4">Nombre</th>
                <th className="p-4">Apellido</th>
                <th className="p-4">Edad</th>
                <th className="p-4">Domicilio</th>
                <th className="p-4">Fecha Solicitud</th>
              </tr>
            </thead>
            <tbody>
              {approvedRequests.length > 0 ? (
                approvedRequests.map((request: any) => (
                  <tr key={request.id_ApplicationForm} className="bg-white text-gray-800 hover:bg-gray-200">
                    <td className="p-4">{request.name_AP}</td>
                    <td className="p-4">{request.lastname1_AP}</td>
                    <td className="p-4">{request.age_AP}</td>
                    <td className="p-4">{request.location}</td>
                    <td className="p-4">{new Date(request.applicationDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No hay solicitudes aprobadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApprovedRequest;
