import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { ResidentMedication } from "../../types/ResidentMedicationType";
import { useMedicationSpecific } from "../../hooks/useMedicationSpecific";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { useCreateResidentMedication } from "../../hooks/useCreateResidentMwedication";

const AddMedicationPage: React.FC = () => {
  const { id } = useParams();
  const residentId = Number(id);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, reset, watch } = useForm<ResidentMedication>();
  const mutation = useCreateResidentMedication();
  const selectedMedicament = watch("id_MedicamentSpecific"); // Captura el valor seleccionado del dropdown

  const { data, isLoading, error } = useMedicationSpecific();

  const onSubmit = (data: ResidentMedication) => {
    mutation.mutate({ ...data, id_Resident: residentId }, {
      onSuccess: () => {
        alert("Medicamento agregado con éxito!");
        reset();
        navigate(`/dashboard/residente-info/${residentId}`);
      },
      onError: (error) => {
        console.error("Error al agregar medicamento:", error);
      },
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Agregar Medicación</h2>

      {isLoading && <LoadingSpinner />}
      {error instanceof Error && <p className="text-red-500">❌ {error.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Dosis prescrita */}
        <div>
          <label className="block text-gray-700">Dosis Prescrita</label>
          <input
            type="number"
            {...register("prescribedDose", { required: true })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Dropdown de medicamentos */}
        <div>
          <label className="block text-gray-700">Seleccionar Medicamento</label>
          <select
            {...register("id_MedicamentSpecific", { required: true })}
            value={selectedMedicament ?? ""}
            onChange={(e) => setValue("id_MedicamentSpecific", Number(e.target.value))}
            className="w-full p-2 border rounded-md bg-white text-gray-900"
          >
            <option value="">Seleccione un medicamento</option>
            {data?.data?.map((med) => (
              <option key={med.id_MedicamentSpecific} value={med.id_MedicamentSpecific}>
                {med.name_MedicamentSpecific}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha de inicio */}
        <div>
          <label className="block text-gray-700">Fecha de Inicio</label>
          <input
            type="date"
            {...register("startDate", { required: true })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-gray-700">Notas</label>
          <textarea
            {...register("notes")}
            className="w-full px-3 py-2 border rounded-md"
          ></textarea>
        </div>

        {/* Botones */}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            onClick={() => navigate(`/dashboard/residente-info/${residentId}`)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Guardando..." : "Agregar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicationPage;
