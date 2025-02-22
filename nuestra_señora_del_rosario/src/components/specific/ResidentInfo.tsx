import { useNavigate, useParams } from "react-router-dom";
import { useResidentInfoById } from "../../hooks/useResidentInfoById";
import { useThemeDark } from "../../hooks/useThemeDark";
import LoadingSpinner from "../microcomponents/LoadingSpinner";

const ResidentDetail: React.FC = () => {
  const { id } = useParams(); // ⬅️ Obtiene el ID desde la URL
  const residentId = Number(id); // Asegura que sea un número
  const navigate = useNavigate()

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
        <p>
          <strong>Cédula:</strong> {resident?.cedula_RD}
        </p>
        <p>
          <strong>Sexo:</strong> {resident?.sexo}
        </p>
        <p>
          <strong>Domicilio:</strong> {resident?.location_RD}
        </p>
        <p>
          <strong>Fecha de Entrada:</strong>{" "}
          {new Date(resident?.entryDate ?? "").toLocaleDateString()}
        </p>
      </div>

      {/* Sección de Medicamentos */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Medicamentos</h3>
        {resident?.medicationNames?.length ? (
          <>
            <ul className="list-disc pl-6">
              {resident.medicationNames.map((med, index) => (
                <li key={index}>{med}</li>
              ))}
            </ul>
            <div className="flex justify-center mt-3">
              <button className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition">
                Editar Medicamentos
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center mt-3">
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
            onClick={() => navigate(`/dashboard/residente/${residentId}/agregar-medicamento`)}
            >
              Agregar Medicamentos
            </button>
          </div>
        )}
      </div>

      {/* Sección de Patologías */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Patologías</h3>
        {resident?.pathologyNames?.length ? (
          <>
            <ul className="list-disc pl-6">
              {resident.pathologyNames.map((path, index) => (
                <li key={index}>{path}</li>
              ))}
            </ul>
            <div className="flex justify-center mt-3">
              <button className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition">
                Editar Patologías
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center mt-3">
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition">
              Agregar Patologías
            </button>
          </div>
        )}
      </div>

      {/* Sección de Citas Médicas */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Citas Médicas</h3>
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
                <tr key={appointment?.id_Appointment} className="text-center">
                  <td className="border border-gray-400 p-2">
                    {new Date(appointment?.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {appointment?.time}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {appointment?.appointmentManager}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {appointment?.healthcareCenterName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tiene citas médicas registradas.</p>
        )}
      </div>
    </div>
  );
};

export default ResidentDetail;
