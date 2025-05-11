import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useMedicalHistoryById } from "../../hooks/useMedicalHistoryById";
import { useUpdateMedicalHistory } from "../../hooks/useUpdateMedicalHistory";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import {  FaArrowLeft } from "react-icons/fa";
import Toast from "../common/Toast";
import { MedicalHistory } from "../../types/MedicalHistoryType";

const UpdateMedicalHistory: React.FC = () => {  const { residentId, id_MedicalHistory } = useParams<{ residentId: string; id_MedicalHistory: string }>();
  const resident_Id = Number(residentId);
  const history_Id = Number(id_MedicalHistory);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors, isDirty, isValid } } = useForm<Partial<MedicalHistory>>({
    mode: 'onBlur'
  });
  const mutation = useUpdateMedicalHistory();
  const { data: medicalHistory, isLoading, error } = useMedicalHistoryById(resident_Id);
  // Estado para manejar mensajes del Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info");
  
  // Estado para controlar si el formulario está completo inicialmente
  const [formLoaded, setFormLoaded] = useState(false);

  useEffect(() => {
    // Filtrar el historial médico usando el id_MedicalHistory
    if (Array.isArray(medicalHistory) && medicalHistory.length > 0) {
      const selectedHistory = medicalHistory.find(
        (record) => Number(record.id_MedicalHistory) === history_Id
      );

      if (selectedHistory) {
        setValue("diagnosis", selectedHistory.diagnosis || "");
        setValue("treatment", selectedHistory.treatment || "");
        setValue("observations", selectedHistory.observations || "");
        // Marcar que el formulario ha sido cargado
        setFormLoaded(true);
      }
    }
  }, [medicalHistory, history_Id, setValue]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar el historial médico.</p>;
  const onSubmit = (data: Partial<MedicalHistory>) => {
    mutation.mutate(
      { id: history_Id, data },
      {
        onSuccess: () => {
          // Guardar mensaje de toast en sessionStorage
          sessionStorage.setItem('medicalHistoryToast', JSON.stringify({
            message: "Historial médico actualizado con éxito!",
            type: "success"
          }));
          // Navegar inmediatamente sin esperar
          navigate(`/dashboard/historial-medico/${resident_Id}`);
        },
        onError: () => {
          setToastMessage("Hubo un error al actualizar el historial médico.");
          setToastType("error");
        },
      }
    );
  };

  return (
    <div className="p-8 rounded-xl shadow-xl w-full max-w-3xl mx-auto bg-white text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Volver
        </button>
        <h2 className="text-2xl font-bold">Actualizar historial médico</h2>
      </div>

      {/* Componente Toast */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">        {/* 🔹 Diagnóstico */}
        <div>
          <label className="block text-lg font-semibold mb-2">Diagnóstico</label>
          <textarea
            {...register("diagnosis", { 
              required: "El diagnóstico es obligatorio",
              minLength: { value: 5, message: "El diagnóstico debe tener al menos 5 caracteres" }
            })}
            rows={3}
            className={`w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 ${
              errors.diagnosis ? "border-red-500" : ""
            }`}
            placeholder="Ingrese el diagnóstico del paciente..."
          />
          {errors.diagnosis && (
            <p className="text-red-500 text-sm mt-1">{errors.diagnosis.message}</p>
          )}
        </div>

        {/* 🔹 Tratamiento */}
        <div>
          <label className="block text-lg font-semibold mb-2">Tratamiento</label>
          <textarea
            {...register("treatment", {
              required: "El tratamiento es obligatorio",
              minLength: { value: 5, message: "El tratamiento debe tener al menos 5 caracteres" }
            })}
            rows={3}
            className={`w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 ${
              errors.treatment ? "border-red-500" : ""
            }`}
            placeholder="Ingrese el tratamiento a seguir..."
          />
          {errors.treatment && (
            <p className="text-red-500 text-sm mt-1">{errors.treatment.message}</p>
          )}
        </div>

        {/* 🔹 Observaciones */}
        <div>
          <label className="block text-lg font-semibold mb-2">Observaciones</label>
          <textarea
            {...register("observations", {
              required: "Las observaciones son obligatorias",
              minLength: { value: 5, message: "Las observaciones deben tener al menos 5 caracteres" }
            })}
            rows={3}
            className={`w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 ${
              errors.observations ? "border-red-500" : ""
            }`}
            placeholder="Ingrese observaciones adicionales..."
          />
          {errors.observations && (
            <p className="text-red-500 text-sm mt-1">{errors.observations.message}</p>
          )}
        </div>        {/* 🔹 Botones */}
        <div className="flex justify-center gap-5 mt-6">          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-md transition ${
              (!isValid && isDirty) || (!formLoaded && !isDirty) || mutation.isLoading 
                ? "bg-blue-300 cursor-not-allowed" 
                : "hover:bg-blue-600"
            }`}
            disabled={(!isValid && isDirty) || (!formLoaded && !isDirty) || mutation.isLoading}
          >
            {mutation.isLoading ? <LoadingSpinner/>: "Actualizar"}
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

export default UpdateMedicalHistory;
