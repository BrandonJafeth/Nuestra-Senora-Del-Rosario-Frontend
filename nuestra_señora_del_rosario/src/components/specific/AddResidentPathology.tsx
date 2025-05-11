import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { ResidentPathology } from "../../types/ResidentPathology";
import { useCreateResidentPathology } from "../../hooks/useCreateResidentPathology";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { usePathologies } from "../../hooks/usePathology";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useToast } from "../../hooks/useToast";
import { useQueryClient } from "react-query";
import Toast from "../common/Toast";

const AddPathologyPage: React.FC = () => {  const { id } = useParams();
  const residentId = Number(id);
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();
  const { showToast, message, type } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, reset, watch, formState: { errors,  isValid } } = useForm<ResidentPathology>({
    mode: 'onChange' // Validar cuando cambie cualquier campo
  });
  const mutation = useCreateResidentPathology();
  const selectedPathology = watch("id_Pathology");

  const { data, isLoading, error } = usePathologies();  const onSubmit = (data: ResidentPathology) => {
    // Validación adicional
    if (!data.resume_Pathology || !data.resume_Pathology.trim()) {
      showToast("El resumen es obligatorio", "error");
      return;
    }
    
    if (!data.id_Pathology || Number(data.id_Pathology) <= 0) {
      showToast("Debe seleccionar una patología", "error");
      return;
    }
    
    if (!data.diagnosisDate) {
      showToast("La fecha de diagnóstico es obligatoria", "error");
      return;
    }
      if (new Date(data.diagnosisDate) > new Date()) {
      showToast("La fecha de diagnóstico no puede ser futura", "error");
      return;
    }
    
    if (new Date(data.registerDate) > new Date()) {
      showToast("La fecha de registro no puede ser futura", "error");
      return;
    }
    
    // Si la fecha de diagnóstico es posterior a la fecha de registro, mostrar un error
    if (new Date(data.diagnosisDate) > new Date(data.registerDate)) {
      showToast("La fecha de diagnóstico no puede ser posterior a la fecha de registro", "error");
      return;
    }
    
    // Si todo está bien, continuar con el envío
    mutation.mutate({ ...data, id_Resident: residentId }, {onSuccess: () => {
        // Guardar mensaje de toast en sessionStorage en lugar de mostrarlo
        sessionStorage.setItem('pathologyToast', JSON.stringify({
          message: "Patología agregada con éxito!",
          type: "success"
        }));
        reset();
        // Invalidar todas las consultas relacionadas
        queryClient.invalidateQueries(["resident", residentId]);
        queryClient.invalidateQueries(["residentInfo", residentId]);
        queryClient.invalidateQueries(["residentPathologies", residentId]);
        
        // Navegar inmediatamente, sin esperar
        queryClient.refetchQueries(["residentInfo", residentId]);
        navigate(`/dashboard/residente-info/${residentId}`);
      },
      onError: (error) => {
        console.error("Error al agregar patología:", error);
        showToast("Error al agregar patología", "error");
      },
    });
  };

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">Agregar Patología</h2>

      {isLoading && <LoadingSpinner />}
      {error instanceof Error && <p className="text-red-500">❌ {error.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">        <div>
          <label className="block">Resumen</label>
          <input
            type="text"
            {...register("resume_Pathology", { 
              required: "El resumen es obligatorio",
              minLength: { value: 3, message: "El resumen debe tener al menos 3 caracteres" }
            })}
            className={`w-full px-3 py-2 border rounded-md ${errors.resume_Pathology ? "border-red-500" : ""} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
          {errors.resume_Pathology && (
            <p className="text-red-500 text-sm mt-1">{errors.resume_Pathology.message}</p>
          )}
        </div>

        <div>
          <label className="block">Seleccionar patología</label>          <select
            {...register("id_Pathology", { 
              required: "Debe seleccionar una patología",
              validate: value => Number(value) > 0 || "Debe seleccionar una patología"
            })}
            value={selectedPathology ?? ""}
            onChange={(e) => setValue("id_Pathology", Number(e.target.value))}
            className={`w-full p-2 border rounded-md ${errors.id_Pathology ? "border-red-500" : ""} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          >
            <option value="">Seleccione una patología</option>
            {data?.map((path) => (
              <option key={path.id_Pathology} value={path.id_Pathology}>
                {path.name_Pathology}
              </option>
            ))}
          </select>
          {errors.id_Pathology && (
            <p className="text-red-500 text-sm mt-1">{errors.id_Pathology.message}</p>
          )}
        </div>

        <div>
          <label className="block">Fecha de diagnóstico</label>          <input
            type="date"
            {...register("diagnosisDate", { 
              required: "La fecha de diagnóstico es obligatoria",
              validate: value => {
                if (new Date(value) > new Date()) return "La fecha no puede ser futura";
                return true;
              }
            })}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2 border rounded-md ${errors.diagnosisDate ? "border-red-500" : ""} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
          {errors.diagnosisDate && (
            <p className="text-red-500 text-sm mt-1">{errors.diagnosisDate.message}</p>
          )}
        </div>

        <div>
          <label className="block">Fecha de registro</label>          <input
            type="date"
            {...register("registerDate", { 
              required: "La fecha de registro es obligatoria",
              validate: value => {
                if (new Date(value) > new Date()) return "La fecha no puede ser futura";
                const diagnosisDate = watch("diagnosisDate");
                if (diagnosisDate && new Date(diagnosisDate) > new Date(value)) 
                  return "La fecha de registro no puede ser anterior a la fecha de diagnóstico";
                return true;
              }
            })}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2 border rounded-md ${errors.registerDate ? "border-red-500" : ""} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
          {errors.registerDate && (
            <p className="text-red-500 text-sm mt-1">{errors.registerDate.message}</p>
          )}
        </div>

        <div>
          <label className="block">Notas</label>
          <textarea
            {...register("notes")}
            className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          ></textarea>
        </div>        <div className="flex justify-center gap-5 mt-6">          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-md transition ${
              !isValid || mutation.isLoading ? 'bg-blue-300 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={mutation.isLoading || !isValid}
          >
            {mutation.isLoading ? "Guardando..." : "Agregar"}
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            onClick={() => navigate(`/dashboard/residente-info/${residentId}`)}
          >
            Cancelar
          </button>
        </div>
      </form>
      
      {/* Mostrar Toast con el mensaje */}
      {message && <Toast message={message} type={type} />}
    </div>
  );
};

export default AddPathologyPage;
