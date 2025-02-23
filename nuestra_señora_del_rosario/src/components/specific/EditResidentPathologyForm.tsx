import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateResidentPathology } from "../../hooks/useUpdateResidentPathology";
import { useResidentInfoById } from "../../hooks/useResidentInfoById";
import { ResidentPathology } from "../../types/ResidentPathology";
import LoadingSpinner from "../microcomponents/LoadingSpinner";

const EditResidentPathology: React.FC = () => {
  const { id, pathologyId } = useParams<{ id: string; pathologyId: string }>(); // Obtiene ID del residente y la patología desde la URL
  const residentId = Number(id);
  const pathologyID = Number(pathologyId);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm<Partial<ResidentPathology>>();

  const mutation = useUpdateResidentPathology();
  const { data: resident, isLoading, error } = useResidentInfoById(residentId);

  useEffect(() => {
    if (resident && resident.pathologies) {
      const pathologyToEdit = resident.pathologies.find((p) => p.id_ResidentPathology === pathologyID);
      if (pathologyToEdit) {
        setValue("resume_Pathology", pathologyToEdit.resume_Pathology);
        setValue("diagnosisDate", pathologyToEdit.diagnosisDate);
        setValue("registerDate", pathologyToEdit.registerDate);
        setValue("notes", pathologyToEdit.notes);
      }
    }
  }, [resident, pathologyID, setValue]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar la información del residente.</p>;

  const onSubmit = (data: Partial<ResidentPathology>) => {
    mutation.mutate(
      { id: pathologyID, data },
      {
        onSuccess: () => {
          alert("✅ Patología actualizada con éxito!");
          navigate(`/dashboard/residente-info/${residentId}`); // Redirige al detalle del residente
        },
        onError: (error) => {
          console.error("❌ Error al actualizar patología:", error);
          alert("❌ Hubo un error al actualizar la patología.");
        },
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Patología</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Resumen */}
        <div>
          <label className="block text-gray-700">Resumen</label>
          <input
            type="text"
            {...register("resume_Pathology")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Fecha de Diagnóstico */}
        <div>
          <label className="block text-gray-700">Fecha de Diagnóstico</label>
          <input
            type="date"
            {...register("diagnosisDate")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Fecha de Registro */}
        <div>
          <label className="block text-gray-700">Fecha de Registro</label>
          <input
            type="date"
            {...register("registerDate")}
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
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Guardando..." : "Actualizar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResidentPathology;
