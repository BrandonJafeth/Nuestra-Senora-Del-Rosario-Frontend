import { useParams, useNavigate } from "react-router-dom";
import { useMedicalHistoryById } from "../../hooks/useMedicalHistoryById";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { FaNotesMedical, FaPlus, FaEdit } from "react-icons/fa";

const MedicalHistory: React.FC = () => {
  const { residentId } = useParams();
  const resident_Id = Number(residentId);
  const navigate = useNavigate();

  const { data: medicalHistory, isLoading, error } = useMedicalHistoryById(resident_Id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar el historial médico.</p>;

  return (
    <div className="p-6 rounded-xl shadow-xl w-full max-w-3xl mx-auto bg-white text-gray-900 relative">

      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaNotesMedical className="text-red-500" size={24} />
        Historial Médico
      </h2>

      {/* 🔹 Historial Médico */}
      {Array.isArray(medicalHistory) && medicalHistory.length ? (
        <div className="space-y-4">
          {medicalHistory.map((record: any) => {
            const recordUpdatedAt = record.editDate ? new Date(record.editDate).toLocaleDateString() : null;
            const recordCreatedAt = new Date(record.creationDate).toLocaleDateString();
            
            return (
              <div key={record.id_MedicalHistory} className="p-4 border rounded-lg shadow-md bg-gray-100 relative">
                {/* 🔹 Fecha de creación y actualización */}
                <p className="text-sm text-gray-600">
                  <strong>Fecha de registro:</strong> {recordCreatedAt}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Última actualización:</strong> {recordUpdatedAt ?? "No editado"}
                </p>

                {/* 🔹 Datos médicos */}
                <p className="text-lg font-semibold text-gray-800">
                  <strong>Diagnóstico:</strong> {record.diagnosis}
                </p>
                <p className="text-gray-700"><strong>Tratamiento:</strong> {record.treatment}</p>
                <p className="text-gray-700"><strong>Observaciones:</strong> {record.observations}</p>
                {record.notes && (
                  <p className="italic text-gray-600 mt-2">
                    <strong>Notas:</strong> {record.notes}
                  </p>
                )}

                {/* 🔹 Botón de editar cada historial */}
                <button
                  className="absolute top-2 right-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
                  onClick={() => navigate(`/dashboard/residente/${resident_Id}/editar-historial/${record.id_MedicalHistory}`)}
                >
                  <FaEdit size={16} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No hay historial médico registrado.</p>
      )}

      {/* 🔹 Botón para agregar nuevo historial */}
      <div className="mt-4 flex justify-center">
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate(`/dashboard/residente/${resident_Id}/agregar-historial`)}
        >
          <FaPlus className="mr-2" size={16} />
          Agregar nuevo historial
        </button>
      </div>
    </div>
  );
};

export default MedicalHistory;
