import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useMedicalHistory } from "../../hooks/useCreateMedicalHistory";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import Toast from "../common/Toast";
import { useThemeDark } from "../../hooks/useThemeDark";
import { MedicalHistoryInput } from "../../types/MedicalHistoryInputType";

const AddMedicalHistoryForm: React.FC = () => {  const { residentId } = useParams();
  const resident_Id = Number(residentId);
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();  
  
  const { register, handleSubmit, reset, formState: { errors, isDirty, isValid } } = useForm<MedicalHistoryInput>({
    mode: 'onBlur', // Validar cuando el campo pierde el foco
    defaultValues: {
      id_Resident: resident_Id,
      diagnosis: "",
      treatment: "",
      observations: "",
    },
  });

  const mutation = useMedicalHistory();  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
    // Utilizamos MedicalHistoryInput para el formulario
  const onSubmit = (data: MedicalHistoryInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        // Almacenar el mensaje de toast en sessionStorage
        sessionStorage.setItem('medicalHistoryToast', JSON.stringify({
          message: "Historial médico agregado con éxito!",
          type: "success"
        }));
        reset();
        // Navegar inmediatamente sin esperar
        navigate(`/dashboard/historial-medico/${resident_Id}`);
      },
      onError: () => {
        setToastMessage("Hubo un error al agregar el historial médico.");
        setToastType("error");
      },
    });
  };

  return (
    <div
      className={`p-8 rounded-xl shadow-xl w-full max-w-3xl mx-auto ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Volver
        </button>
        <h2 className="text-2xl font-bold">Agregar Historial médico</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">        <div>
          <label className="block text-lg font-semibold mb-2">Diagnóstico</label>
          <textarea
            {...register("diagnosis", { 
              required: "El diagnóstico es obligatorio",
              minLength: { value: 5, message: "El diagnóstico debe tener al menos 5 caracteres" }
            })}
            rows={3}
            className={`w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 ${
              errors.diagnosis ? "border-red-500 " : ""
            }${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
            }`}
            placeholder="Ingrese el diagnóstico del paciente..."
          />
          {errors.diagnosis && (
            <p className="text-red-500 text-sm mt-1">{errors.diagnosis.message}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Tratamiento</label>
          <textarea
            {...register("treatment", { 
              required: "El tratamiento es obligatorio",
              minLength: { value: 5, message: "El tratamiento debe tener al menos 5 caracteres" }
            })}
            rows={3}
            className={`w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 ${
              errors.treatment ? "border-red-500 " : ""
            }${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
            }`}
            placeholder="Ingrese el tratamiento a seguir..."
          />
          {errors.treatment && (
            <p className="text-red-500 text-sm mt-1">{errors.treatment.message}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Observaciones</label>
          <textarea
            {...register("observations", { 
              required: "Las observaciones son obligatorias",
              minLength: { value: 5, message: "Las observaciones deben tener al menos 5 caracteres" }
            })}
            rows={3}
            className={`w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 ${
              errors.observations ? "border-red-500 " : ""
            }${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
            }`}
            placeholder="Ingrese observaciones adicionales..."
          />
          {errors.observations && (
            <p className="text-red-500 text-sm mt-1">{errors.observations.message}</p>
          )}
        </div>        <div className="flex justify-center gap-5 mt-6">          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-md transition flex items-center gap-2 ${
              (!isValid && isDirty) || mutation.isLoading 
                ? "bg-blue-300 cursor-not-allowed" 
                : "hover:bg-blue-600"
            }`}
            disabled={(!isValid && isDirty) || mutation.isLoading}
          >
            {mutation.isLoading ? <LoadingSpinner /> : "Agregar"}
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

export default AddMedicalHistoryForm;
