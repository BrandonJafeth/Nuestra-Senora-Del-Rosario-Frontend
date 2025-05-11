import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateResidentPathology } from "../../hooks/useUpdateResidentPathology";
import { useResidentInfoById } from "../../hooks/useResidentInfoById";
import { ResidentPathology } from "../../types/ResidentPathology";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import Toast from "../common/Toast";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useQueryClient } from "react-query";

const EditResidentPathology: React.FC = () => {  const { id, id_ResidentPathology } = useParams<{ id: string; id_ResidentPathology: string }>(); 
  const residentId = Number(id);
  const pathologyID = Number(id_ResidentPathology);
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<Partial<ResidentPathology>>({
    mode: 'onChange' // Validar cuando cambie cualquier campo
  });
  const mutation = useUpdateResidentPathology();
  const { data: resident, isLoading, error } = useResidentInfoById(residentId);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info");

  const [pathologyName, setPathologyName] = useState<string>("");
  const [registerDate, setRegisterDate] = useState<string>("");
  const [diagnosisDate, setDiagnosisDate] = useState<string>("");

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (resident && resident.pathologies) {
      const pathologyToEdit = resident.pathologies.find((p) => p.id_ResidentPathology === pathologyID);

      if (pathologyToEdit) {
        setValue("id_ResidentPathology", pathologyToEdit.id_ResidentPathology);
        setValue("id_Pathology", pathologyToEdit.id_Pathology);
        setValue("id_Resident", residentId);
        setValue("resume_Pathology", pathologyToEdit.resume_Pathology);
        setValue("notes", pathologyToEdit.notes);

        const formattedDiagnosisDate = pathologyToEdit.diagnosisDate 
          ? pathologyToEdit.diagnosisDate.split("T")[0] 
          : todayDate;
        
        setValue("diagnosisDate", formattedDiagnosisDate);
        setDiagnosisDate(formattedDiagnosisDate);

        const formattedRegisterDate = pathologyToEdit.registerDate 
          ? pathologyToEdit.registerDate.split("T")[0] 
          : todayDate;

        setValue("registerDate", formattedRegisterDate);
        setRegisterDate(formattedRegisterDate);

        setPathologyName(pathologyToEdit.name_Pathology || "Desconocida");
      }
    }
  }, [resident, pathologyID, setValue, todayDate]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar la información del residente.</p>;

  const handleDiagnosisDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDiagnosisDate(newDate);
    setValue("diagnosisDate", newDate);
  };  const onSubmit = (data: Partial<ResidentPathology>) => {
    // Validaciones adicionales
    if (!data.resume_Pathology || !data.resume_Pathology.trim()) {
      setToastMessage("El resumen es obligatorio");
      setToastType("error");
      return;
    }
    
    if (new Date(diagnosisDate) > new Date()) {
      setToastMessage("La fecha de diagnóstico no puede ser futura");
      setToastType("error");
      return;
    }
    
    if (new Date(diagnosisDate) > new Date(registerDate)) {
      setToastMessage("La fecha de diagnóstico no puede ser posterior a la fecha de registro");
      setToastType("error");
      return;
    }
    
    // Si todo está bien, continuar con el envío
    const formattedData = {
      ...data,
      diagnosisDate: diagnosisDate,
      registerDate: registerDate
    };
    
    mutation.mutate(
      { id: pathologyID, data: formattedData },
      {
        onSuccess: () => {          // Invalidate both query patterns - the one used in ResidentInfo and the one used in hooks
          queryClient.invalidateQueries(['resident', residentId]);
          queryClient.invalidateQueries(['residentInfo', residentId]);
          queryClient.invalidateQueries(['residentPathologies', residentId]);
          
          // Store success message in sessionStorage to show it in ResidentInfo
          sessionStorage.setItem('pathologyToast', JSON.stringify({
            message: "Patología actualizada con éxito!",
            type: "success"
          }));
          
          // Force a refetch of the data before navigating
          queryClient.refetchQueries(['residentInfo', residentId]);
          navigate(`/dashboard/residente-info/${residentId}`);
        },
        onError: (error) => {
          console.error("Error al actualizar la patología:", error);
          setToastMessage("Hubo un error al actualizar la patología.");
          setToastType("error");
        },
      }
    );
  };

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-md ${isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Patología</h2>

      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Nombre de la patología</label>
          <div className="relative">
            <input
              type="text"
              value={pathologyName}
              className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-200 border-gray-300 text-gray-700"} cursor-not-allowed`}
              disabled
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            </span>
          </div>
          <input type="hidden" {...register("id_Pathology")} />
          <input type="hidden" {...register("id_Resident")} />
        </div>        <div>
          <label className="block">Resumen</label>
          <textarea
            {...register("resume_Pathology", {
              required: "El resumen es obligatorio",
              minLength: { value: 3, message: "El resumen debe tener al menos 3 caracteres" }
            })}
            className={`w-full p-2 border rounded-md ${errors.resume_Pathology ? "border-red-500" : ""} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
            rows={4}
          ></textarea>
          {errors.resume_Pathology && (
            <p className="text-red-500 text-sm mt-1">{errors.resume_Pathology.message}</p>
          )}
        </div>        <div>
          <label className="block">Fecha de diagnóstico</label>
          <input
            type="date"
            value={diagnosisDate}
            onChange={handleDiagnosisDateChange}
            max={todayDate}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
          {new Date(diagnosisDate) > new Date() && (
            <p className="text-red-500 text-sm mt-1">La fecha no puede ser futura</p>
          )}
          {new Date(diagnosisDate) > new Date(registerDate) && (
            <p className="text-red-500 text-sm mt-1">La fecha de diagnóstico no puede ser posterior a la fecha de registro</p>
          )}
        </div>

        <div>
          <label className="block">Fecha de registro</label>
          <div className="relative">
            <input
              type="date"
              value={registerDate}
              className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-200 border-gray-300 text-gray-700"} cursor-not-allowed`}
              disabled
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            </span>
          </div>
          <input type="hidden" {...register("registerDate")} value={registerDate} />
        </div>

        <div>
          <label className="block">Notas</label>
          <textarea
            {...register("notes")}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          ></textarea>
        </div>        <div className="flex justify-center gap-5 mt-6">          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-md transition ${
              !isValid || mutation.isLoading || new Date(diagnosisDate) > new Date() || new Date(diagnosisDate) > new Date(registerDate) 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'hover:bg-blue-600'
            }`}
            disabled={
              mutation.isLoading || 
              !isValid || 
              new Date(diagnosisDate) > new Date() || 
              new Date(diagnosisDate) > new Date(registerDate)
            }
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
