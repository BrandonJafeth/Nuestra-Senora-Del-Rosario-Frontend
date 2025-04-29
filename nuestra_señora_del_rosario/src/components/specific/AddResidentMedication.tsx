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

const AddMedicationPage: React.FC = () => {
  const { id } = useParams();
  const residentId = Number(id);
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();
  const { showToast, message, type } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, reset, watch } = useForm<ResidentMedication>();
  const mutation = useCreateResidentMedication();
  const selectedMedicament = watch("id_MedicamentSpecific");

  const { data, isLoading, error } = useMedicationSpecific();

  const onSubmit = (data: ResidentMedication) => {
    mutation.mutate({ ...data, id_Resident: residentId }, {
      onSuccess: () => {
        showToast("Medicamento agregado con éxito!", "success");
        reset();
        // Invalidar consultas relacionadas con los medicamentos del residente para forzar una recarga
        queryClient.invalidateQueries(["residentMedications", residentId]);
        // Esperar un momento para que el toast sea visible antes de navegar
        setTimeout(() => {
          navigate(`/dashboard/residente-info/${residentId}`);
        }, 1500);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Dosis prescrita</label>
          <input
            type="number"
            {...register("prescribedDose", { required: true })}
            className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
        </div>

        <div>
          <label className="block">Seleccionar medicamento</label>
          <select
            {...register("id_MedicamentSpecific", { required: true })}
            value={selectedMedicament ?? ""}
            onChange={(e) => setValue("id_MedicamentSpecific", Number(e.target.value))}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          >
            <option value="">Seleccione un medicamento</option>
            {data?.data?.map((med) => (
              <option key={med.id_MedicamentSpecific} value={med.id_MedicamentSpecific}>
                {med.name_MedicamentSpecific}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Fecha de inicio</label>
          <input
            type="date"
            {...register("startDate", { required: true })}
            className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
        </div>

        <div>
          <label className="block">Notas</label>
          <textarea
            {...register("notes")}
            className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          ></textarea>
        </div>

        <div className="flex justify-center gap-5 mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={mutation.isLoading}
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
