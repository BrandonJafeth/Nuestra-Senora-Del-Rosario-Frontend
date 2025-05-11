import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { ResidentMedication } from "../../types/ResidentMedicationType";
import { useMedicationSpecific } from "../../hooks/useMedicationSpecific";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { useCreateResidentMedication } from "../../hooks/useCreateResidentMedication";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useToast } from "../../hooks/useToast";
import { useQueryClient } from "react-query";
import Toast from "../common/Toast";

const AddMedicationPage: React.FC = () => {  const { id } = useParams();
  const residentId = Number(id);
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();
  const { showToast, message, type } = useToast();
  const queryClient = useQueryClient();  const { register, handleSubmit, setValue, reset, watch, formState: { errors, isValid } } = useForm<ResidentMedication>({
    mode: 'onChange' // Validar cuando cambie cualquier campo
  });
  const mutation = useCreateResidentMedication();
  const selectedMedicament = watch("id_MedicamentSpecific");
  
  // Estado para almacenar la unidad de medida del medicamento seleccionado
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>("");

  const { data, isLoading, error } = useMedicationSpecific();const onSubmit = (data: ResidentMedication) => {
    // Validación adicional
    if (data.prescribedDose <= 0) {
      showToast("La dosis prescrita debe ser mayor que 0", "error");
      return;
    }
    
    if (!data.id_MedicamentSpecific || Number(data.id_MedicamentSpecific) <= 0) {
      showToast("Debe seleccionar un medicamento", "error");
      return;
    }
    
    if (!data.startDate) {
      showToast("La fecha de inicio es obligatoria", "error");
      return;
    }
    
    if (new Date(data.startDate) > new Date()) {
      showToast("La fecha de inicio no puede ser futura", "error");
      return;
    }
    
    // Si todo está bien, continuar con el envío
    mutation.mutate({ ...data, id_Resident: residentId }, {onSuccess: () => {
        // Guardar mensaje de toast en sessionStorage en lugar de mostrarlo
        sessionStorage.setItem('medicationToast', JSON.stringify({
          message: "Medicamento agregado con éxito!",
          type: "success"
        }));
        reset();
        // Invalidar todas las consultas relacionadas
        queryClient.invalidateQueries(["resident", residentId]);
        queryClient.invalidateQueries(["residentInfo", residentId]);
        queryClient.invalidateQueries(["residentMedications", residentId]);
        queryClient.invalidateQueries(["/MedicationSpecific"]);
        
        // Navegar inmediatamente, sin esperar
        queryClient.refetchQueries(["residentInfo", residentId]);
        navigate(`/dashboard/residente-info/${residentId}`);
      },
      onError: (error) => {
        console.error("Error al agregar medicamento:", error);
        showToast("Error al agregar medicamento", "error");
      },
    });
  };

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">Agregar Medicación</h2>

      {isLoading && <LoadingSpinner />}
      {error instanceof Error && <p className="text-red-500">❌ {error.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">        <div>
          <label className="block">Dosis prescrita</label>
          <input
            type="number"
            {...register("prescribedDose", { 
              required: "La dosis prescrita es obligatoria",
              min: { value: 0.1, message: "La dosis debe ser mayor que 0" },
              validate: value => value > 0 || "La dosis debe ser mayor que 0"
            })}
            className={`w-full px-3 py-2 border rounded-md ${errors.prescribedDose ? "border-red-500" : ""} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
          {errors.prescribedDose && (
            <p className="text-red-500 text-sm mt-1">{errors.prescribedDose.message}</p>
          )}
        </div>        <div>
          <label className="block">Seleccionar medicamento</label>
          <select
            {...register("id_MedicamentSpecific", { 
              required: "Debe seleccionar un medicamento",
              validate: value => Number(value) > 0 || "Debe seleccionar un medicamento"
            })}
            value={selectedMedicament ?? ""}
            onChange={(e) => {
              const medicamentId = Number(e.target.value);
              setValue("id_MedicamentSpecific", medicamentId);
              
              // Buscar la unidad de medida del medicamento seleccionado
              if (medicamentId > 0 && data?.data) {
                const selectedMed = data.data.find(med => med.id_MedicamentSpecific === medicamentId);
                if (selectedMed) {
                  setUnitOfMeasure(selectedMed.unitOfMeasureName);
                } else {
                  setUnitOfMeasure("");
                }
              } else {
                setUnitOfMeasure("");
              }
            }}
            className={`w-full p-2 border rounded-md ${errors.id_MedicamentSpecific ? "border-red-500" : ""} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          >
            <option value="">Seleccione un medicamento</option>
            {data?.data?.map((med) => (
              <option key={med.id_MedicamentSpecific} value={med.id_MedicamentSpecific}>
                {med.name_MedicamentSpecific}
              </option>
            ))}
          </select>
          {errors.id_MedicamentSpecific && (
            <p className="text-red-500 text-sm mt-1">{errors.id_MedicamentSpecific.message}</p>
          )}
          
          {/* Campo para mostrar la unidad de medida (solo visible cuando hay un medicamento seleccionado) */}
          {unitOfMeasure && (
            <div className="mt-2">
              <label className="block text-sm">Unidad de medida</label>
              <input
                type="text"
                value={unitOfMeasure}
                readOnly
                className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${isDarkMode ? "bg-gray-600 border-gray-500 text-gray-300" : "bg-gray-100 border-gray-200 text-gray-700"}`}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block">Fecha de inicio</label>
          <input
            type="date"
            {...register("startDate", { 
              required: "La fecha de inicio es obligatoria",
              validate: value => {
                if (new Date(value) > new Date()) return "La fecha no puede ser futura";
                return true;
              }
            })}
            className={`w-full px-3 py-2 border rounded-md ${errors.startDate ? "border-red-500" : ""} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block">Notas</label>
          <textarea
            {...register("notes")}
            className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          ></textarea>
        </div>        <div className="flex justify-center gap-5 mt-6">
          <button
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

export default AddMedicationPage;
