import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateResidentPathology } from "../../hooks/useUpdateResidentPathology";
import { useResidentInfoById } from "../../hooks/useResidentInfoById";
import { ResidentPathology } from "../../types/ResidentPathology";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import Toast from "../common/Toast";
import { useThemeDark } from "../../hooks/useThemeDark";

const EditResidentPathology: React.FC = () => {
  const { id, id_ResidentPathology } = useParams<{ id: string; id_ResidentPathology: string }>(); 
  const residentId = Number(id);
  const pathologyID = Number(id_ResidentPathology);
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();

  const { register, handleSubmit, setValue } = useForm<Partial<ResidentPathology>>();
  const mutation = useUpdateResidentPathology();
  const { data: resident, isLoading, error } = useResidentInfoById(residentId);

  // Estado para manejar los mensajes del Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info");

  // Estado para almacenar el nombre de la patología y las fechas
  const [pathologyName, setPathologyName] = useState<string>("");
  const [registerDate, setRegisterDate] = useState<string>("");
  const [diagnosisDate, setDiagnosisDate] = useState<string>("");

  // Obtener la fecha actual en formato YYYY-MM-DD
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (resident && resident.pathologies) {
      const pathologyToEdit = resident.pathologies.find((p) => p.id_ResidentPathology === pathologyID);

      if (pathologyToEdit) {
        setValue("id_ResidentPathology", pathologyToEdit.id_ResidentPathology);
        setValue("id_Pathology", pathologyToEdit.id_Pathology);
        setValue("id_Resident", residentId); // Se envía el ID del residente
        setValue("resume_Pathology", pathologyToEdit.resume_Pathology);
        setValue("notes", pathologyToEdit.notes);

        // Procesar la fecha de diagnóstico
        const formattedDiagnosisDate = pathologyToEdit.diagnosisDate 
          ? pathologyToEdit.diagnosisDate.split("T")[0] 
          : todayDate;
        
        setValue("diagnosisDate", formattedDiagnosisDate);
        setDiagnosisDate(formattedDiagnosisDate);

        // Asegurar que la fecha de registro no sea null ni undefined
        const formattedRegisterDate = pathologyToEdit.registerDate 
          ? pathologyToEdit.registerDate.split("T")[0] 
          : todayDate; // Si es null, usar la fecha actual

        setValue("registerDate", formattedRegisterDate);
        setRegisterDate(formattedRegisterDate); // Guardamos en el estado para mostrarlo en el input

        // Guardar el nombre de la patología
        setPathologyName(pathologyToEdit.name_Pathology || "Desconocida");
      }
    }
  }, [resident, pathologyID, setValue, todayDate]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar la información del residente.</p>;

  const onSubmit = (data: Partial<ResidentPathology>) => {
    mutation.mutate(
      { id: pathologyID, data },
      {
        onSuccess: () => {
          setToastMessage("Patología actualizada con éxito!");
          setToastType("success");
          setTimeout(() => navigate(`/dashboard/residente-info/${residentId}`), 3000); // Redirige después del Toast
        },
        onError: () => {
          setToastMessage("Hubo un error al actualizar la patología.");
          setToastType("error");
        },
      }
    );
  };

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-md ${isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Patología</h2>

      {/* Componente Toast */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre de la Patología (Solo visual, se envía el ID) */}
        <div>
          <label className="block">Nombre de la patología</label>
          <input
            type="text"
            value={pathologyName} // Muestra el nombre de la patología
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
            disabled
          />
          <input type="hidden" {...register("id_Pathology")} /> {/* Enviar el ID real */}
          <input type="hidden" {...register("id_Resident")} /> {/* Enviar el ID del residente */}
        </div>

        {/* Resumen */}
        <div>
          <label className="block">Resumen</label>
          <textarea
            {...register("resume_Pathology")}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
            rows={4} // Hace el campo más grande
          ></textarea>
        </div>

        {/* Fecha de Diagnóstico (Ahora muestra la fecha correcta) */}
        <div>
          <label className="block">Fecha de diagnóstico</label>
          <input
            type="date"
            value={diagnosisDate}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
            disabled
          />
          <input type="hidden" {...register("diagnosisDate")} value={diagnosisDate} />
        </div>

        {/* Fecha de Registro (No editable, usa la que ya está registrada) */}
        <div>
          <label className="block">Fecha de registro</label>
          <input
            type="date"
            value={registerDate} // Muestra la fecha registrada o la actual si era null
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
            disabled
          />
          <input type="hidden" {...register("registerDate")} value={registerDate} /> {/* Se envía la fecha registrada */}
        </div>

        {/* Notas */}
        <div>
          <label className="block">Notas</label>
          <textarea
            {...register("notes")}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          ></textarea>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-5 mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? <LoadingSpinner/> : "Actualizar"}
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResidentPathology;
