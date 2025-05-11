import { useNavigate, useParams } from "react-router-dom";
import { useResidentInfoById } from "../../hooks/useResidentInfoById";
import { useThemeDark } from "../../hooks/useThemeDark";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { FaEdit, FaFilePdf, FaArrowLeft, FaNotesMedical } from "react-icons/fa";
import ResidentPDF from "../microcomponents/ResidentPDF";
import { pdf } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import Toast from "../common/Toast";

const ResidentDetail: React.FC = () => {
  const { id } = useParams();
  const residentId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isDarkMode } = useThemeDark();
  const { data: resident, isLoading, error } = useResidentInfoById(residentId);
  
  // Estado para mostrar el toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");

  // Force a refresh of the resident data when component mounts
  useEffect(() => {
    // Refetch data when component mounts to ensure it's fresh
    queryClient.refetchQueries(['residentInfo', residentId]);
    
    // Check for toast messages in sessionStorage
    const medicationToast = sessionStorage.getItem('medicationToast');
    const pathologyToast = sessionStorage.getItem('pathologyToast');
    
    if (medicationToast) {
      const { message, type } = JSON.parse(medicationToast);
      setToastMessage(message);
      setToastType(type);
      sessionStorage.removeItem('medicationToast');
    } else if (pathologyToast) {
      const { message, type } = JSON.parse(pathologyToast);
      setToastMessage(message);
      setToastType(type);
      sessionStorage.removeItem('pathologyToast');
    }
  }, [residentId, queryClient]);

  const handleDownloadPDF = async () => {
    if (!resident) return;
    
    // Generar PDF como blob
    const blob = await pdf(<ResidentPDF resident={resident} />).toBlob();
    
    // Crear URL del Blob
    const url = URL.createObjectURL(blob);

    // Crear y simular un enlace de descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = `residente_${resident.name_RD}_${resident.lastname1_RD}.pdf`;
    document.body.appendChild(a);
    a.click();

    // Limpiar el URL del blob después de la descarga
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <p className="text-red-500">Error al cargar la información del residente.</p>;

  return (    <div
      className={`relative p-6 rounded-xl shadow-xl w-full max-w-3xl mx-auto ${
        isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Mostrar Toast si hay mensaje */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      {/* Botón para regresar a la página de cardex */}
      <button
        onClick={() => navigate('/dashboard/cardex')}
        className={`absolute top-4 left-4 p-2 rounded-full flex items-center justify-center ${
          isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
        } transition-colors`}
        aria-label="Volver al cardex"
      >
        <FaArrowLeft />
      </button>

      {/* Botón PDF en la parte superior derecha */}
      {resident && (
        <div className="absolute top-4 right-4">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <FaFilePdf className="mr-2" size={18} />
            Descargar PDF
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-center">
        {resident?.name_RD} {resident?.lastname1_RD} {resident?.lastname2_RD}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p><strong>Cédula:</strong> {resident?.cedula_RD}</p>
        <p><strong>Sexo:</strong> {resident?.sexo}</p>
        <p><strong>Edad:</strong> {resident?.age} años</p>
        <p><strong>Ubicación:</strong> {resident?.location_RD}</p>
        <p><strong>Status:</strong> {resident?.status}</p>
        <p><strong>Fecha de entrada:</strong> {new Date(resident?.entryDate ?? "").toLocaleDateString()}</p>
      </div>

      {/* Sección de Medicamentos */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow flex flex-col min-h-[200px]">
        <h3 className="text-lg font-semibold mb-2">📌 Medicamentos</h3>
        {resident?.medications?.length ? (
          <ul className="list-disc pl-6 flex-grow">
            {resident.medications.map((med) => (
              <li key={med.id_ResidentMedication} className="flex justify-between items-center mb-2">
                <div>
                  <strong>{med.name_MedicamentSpecific}</strong> - {med.prescribedDose} {med.unitOfMeasureName}
                  <br />
                  <small className="text-gray-600 dark:text-gray-300">Notas: {med.notes}</small>
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
          <p className="text-gray-500 text-center flex-grow">No hay medicamentos registrados.</p>
        )}

        {/* Botón fijo al fondo */}
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
            onClick={() => navigate(`/dashboard/residente/${residentId}/agregar-medicamento`)}
          >
            Agregar medicamentos
          </button>
        </div>
      </div>

      {/* Sección de Patologías */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow flex flex-col min-h-[200px]">
        <h3 className="text-lg font-semibold mb-2">⚕️ Patologías</h3>
        {resident?.pathologies?.length ? (
          <ul className="list-disc pl-6 flex-grow">
            {resident.pathologies.map((path) => (              <li key={path.id_ResidentPathology} className="flex justify-between items-center mb-2">
                <div>
                  <strong>{path.name_Pathology}</strong> : {path.resume_Pathology}
                  <br />
                  <small className="text-gray-600 dark:text-gray-300">Notas : {path.notes}</small>
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
          <p className="text-gray-500 text-center flex-grow">No hay patologías registradas.</p>
        )}

        {/* Botón fijo al fondo */}
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
            onClick={() => navigate(`/dashboard/residente/${residentId}/agregar-patologia`)}
          >
            Agregar patologías
          </button>
        </div>
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
          <p className="text-gray-500 text-center">No tiene citas médicas registradas.</p>
        )}
      </div>

      {/* Botón para ir al historial médico */}
      <div className="mt-6 flex justify-center">
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition flex items-center"
          onClick={() => navigate(`/dashboard/historial-medico/${residentId}`)}
        >
          <FaNotesMedical className="mr-2" />
          Ver Historial Médico
        </button>
      </div>
    </div>
  );
};

export default ResidentDetail;
