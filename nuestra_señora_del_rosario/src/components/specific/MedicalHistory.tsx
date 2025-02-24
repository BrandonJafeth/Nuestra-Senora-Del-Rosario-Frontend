import { useParams, useNavigate } from "react-router-dom";
import { useMedicalHistoryById } from "../../hooks/useMedicalHistoryById";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { FaNotesMedical, FaPlus } from "react-icons/fa";

const MedicalHistory: React.FC = () => {
  const { residentId } = useParams();
  const resident_Id = Number(residentId);
  const navigate = useNavigate();

  const { data: medicalHistory, isLoading, error } = useMedicalHistoryById(resident_Id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar el historial médico.</p>;

  // 🔹 Buscar la última fecha de edición
  const lastUpdated = Array.isArray(medicalHistory) && medicalHistory.length
    ? new Date(
        Math.max(...medicalHistory.map((record: any) => new Date(record.editDate ?? record.creationDate).getTime()))
      ).toLocaleDateString()
    : "Sin actualizar";

  // 🔹 Obtener el último historial médico para editar
  const lastMedicalHistory = Array.isArray(medicalHistory) && medicalHistory.length ? medicalHistory[0].id_MedicalHistory : null;

  return (
    <div className="p-6 rounded-xl shadow-xl w-full max-w-3xl mx-auto bg-white text-gray-900 relative">

     

      {/* 🔹 Última actualización */}
      <p className="absolute top-4 right-6 text-sm text-gray-600">
        Última actualización: <strong>{lastUpdated}</strong>
      </p>

      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaNotesMedical className="text-red-500" size={24} />
        Historial Médico
      </h2>

      {Array.isArray(medicalHistory) && medicalHistory.length ? (
        <div className="space-y-4">
          {medicalHistory.map((record: any) => (
            <div key={record.id_MedicalHistory} className="p-4 border rounded-lg shadow-md bg-gray-100">
              <p className="text-sm text-gray-600">
                <strong>Fecha de registro:</strong> {new Date(record.creationDate).toLocaleDateString()}
              </p>
              <br />
              <p className="text-lg font-semibold text-gray-800">
                <strong>Diagnóstico:</strong> {record.diagnosis}
              </p>
              <br />
              <p className="text-gray-700"><strong>Tratamiento:</strong> {record.treatment}</p>
              <br />
              <p className="text-gray-700"><strong>Observaciones:</strong> {record.observations}</p>
              {record.notes && (
                <p className="italic text-gray-600 mt-2">
                  <strong>Notas:</strong> {record.notes}
                </p>
                
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No hay historial médico registrado.</p>
      )}
      <div className="mt-2 flex justify-center gap-3">
        {!lastMedicalHistory && (
          <button
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            onClick={() => navigate(`/dashboard/residente/${resident_Id}/agregar-historial`)}
          >
            <FaPlus className="mr-2" size={16} />
            Agregar
          </button>
        )}

        {lastMedicalHistory && (
          <button
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate(`/dashboard/residente/${resident_Id}/editar-historial/${lastMedicalHistory}`)}
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
