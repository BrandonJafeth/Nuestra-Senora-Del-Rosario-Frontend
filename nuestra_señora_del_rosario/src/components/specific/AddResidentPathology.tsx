import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { ResidentPathology } from "../../types/ResidentPathology";
import { useCreateResidentPathology } from "../../hooks/useCreateResidentPathology";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { usePathologies } from "../../hooks/usePathology";

const AddPathologyPage: React.FC = () => {
  const { id } = useParams();
  const residentId = Number(id);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, reset, watch } = useForm<ResidentPathology>();
  const mutation = useCreateResidentPathology();
  const selectedPathology = watch("id_Pathology");

  const { data, isLoading, error } = usePathologies();

  const onSubmit = (data: ResidentPathology) => {
    mutation.mutate({ ...data, id_Resident: residentId }, {
      onSuccess: () => {
        alert("Patología agregada con éxito!");
        reset();
        navigate(`/dashboard/residente-info/${residentId}`);
      },
      onError: (error) => {
        console.error("Error al agregar patología:", error);
      },
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Agregar Patología</h2>

      {isLoading && <LoadingSpinner />}
      {error instanceof Error && <p className="text-red-500">❌ {error.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Resumen de la patología */}
        <div>
          <label className="block text-gray-700">Resumen</label>
          <input
            type="text"
            {...register("resume_Pathology", { required: true })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Dropdown de patologías */}
        <div>
          <label className="block text-gray-700">Seleccionar Patología</label>
          <select
            {...register("id_Pathology", { required: true })}
            value={selectedPathology ?? ""}
            onChange={(e) => setValue("id_Pathology", Number(e.target.value))}
            className="w-full p-2 border rounded-md bg-white text-gray-900"
          >
            <option value="">Seleccione una patología</option>
            {data?.data?.map((pathology) => (
              <option key={pathology.id_Pathology} value={pathology.id_Pathology}>
                {pathology.name_Pathology}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha de diagnóstico */}
        <div>
          <label className="block text-gray-700">Fecha de Diagnóstico</label>
          <input
            type="date"
            {...register("diagnosisDate", { required: true })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Fecha de registro */}
        <div>
          <label className="block text-gray-700">Fecha de Registro</label>
          <input
            type="date"
            {...register("registerDate", { required: true })}
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

export default AddPathologyPage;
