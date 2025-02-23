import { useNavigate, useParams } from "react-router-dom";
import { useResidentInfoById } from "../../hooks/useResidentInfoById";
import { useThemeDark } from "../../hooks/useThemeDark";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { FaEdit } from "react-icons/fa";

const ResidentDetail: React.FC = () => {
  const { id } = useParams();
  const residentId = Number(id);
  const navigate = useNavigate();

  const { isDarkMode } = useThemeDark();
  const { data: resident, isLoading, error } = useResidentInfoById(residentId);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <p className="text-red-500">Error al cargar la información del residente.</p>;

  return (
    <div
      className={`p-6 rounded-xl shadow-xl w-full max-w-3xl mx-auto ${
        isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        {resident?.name_RD} {resident?.lastname1_RD} {resident?.lastname2_RD}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p><strong>Cédula:</strong> {resident?.cedula_RD}</p>
        <p><strong>Sexo:</strong> {resident?.sexo}</p>
        <p><strong>Edad:</strong> {resident?.age} años</p>
        <p><strong>Ubicación:</strong> {resident?.location_RD}</p>
        <p><strong>Status:</strong> {resident?.status}</p>
        <p><strong>Fecha de Entrada:</strong> {new Date(resident?.entryDate ?? "").toLocaleDateString()}</p>
      </div>

      {/* Sección de Medicamentos */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">📌 Medicamentos</h3>
        {resident?.medications?.length ? (
          <ul className="list-disc pl-6">
            {resident.medications.map((med) => (
              <li key={med.id_ResidentMedication} className="flex justify-between items-center mb-2">
                <div>
                  <strong>{med.name_MedicamentSpecific}</strong> - {med.prescribedDose} {med.unitOfMeasureName}
                  <br />
                  <small className="text-gray-600">Notas: {med.notes}</small>
                </div>
                <button
  className="ml-4 bg-orange-500 text-white px-2 py-1 text-sm rounded-md hover:bg-orange-600 transition"
  onClick={() => {
    navigate(`/dashboard/residente-info/${residentId}/editar-medicamento/${med.id_ResidentMedication}`);
  }}
>
  <FaEdit size={20} />
</button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center mt-3">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
              onClick={() => navigate(`/dashboard/residente/${residentId}/agregar-medicamento`)}
            >
              Agregar Medicamentos
            </button>
          </div>
        )}
      </div>

      {/* Sección de Patologías */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">⚕️ Patologías</h3>
        {resident?.pathologies?.length ? (
          <ul className="list-disc pl-6">
            {resident.pathologies.map((path) => (
              <li key={path.id_ResidentPathology} className="flex justify-between items-center mb-2">
                <div>
                  <strong>{path.name_Pathology}</strong> : {path.resume_Pathology}
                  <br />
                  <small className="text-gray-600">Notas : {path.notes}</small>
                </div>
                <button
                  className="ml-4 bg-orange-500 text-white px-2 py-1 text-sm rounded-md hover:bg-orange-600 transition"
                  onClick={() => navigate(`/dashboard/residente/${residentId}/editar-patologia/${path.id_ResidentPathology}`)}
                >
                  <FaEdit size={20} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center mt-3">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
              onClick={() => navigate(`/dashboard/residente/${residentId}/agregar-patologia`)}
            >
              Agregar Patologías
            </button>
          </div>
        )}
      </div>

      {/* Sección de Citas Médicas */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">📅 Citas Médicas</h3>
        {resident?.appointments?.length ? (
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border border-gray-400 p-2">Fecha</th>
                <th className="border border-gray-400 p-2">Hora</th>
                <th className="border border-gray-400 p-2">Encargado</th>
                <th className="border border-gray-400 p-2">Centro Médico</th>
              </tr>
            </thead>
            <tbody>
              {resident.appointments.map((appointment) => (
                <tr key={appointment.id_Appointment} className="text-center">
                  <td className="border border-gray-400 p-2">{new Date(appointment.date).toLocaleDateString()}</td>
                  <td className="border border-gray-400 p-2">{appointment.time}</td>
                  <td className="border border-gray-400 p-2">{appointment.appointmentManager}</td>
                  <td className="border border-gray-400 p-2">{appointment.healthcareCenterName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No tiene citas médicas registradas.</p>
        )}
      </div>
    </div>
  );
};

export default ResidentDetail;
