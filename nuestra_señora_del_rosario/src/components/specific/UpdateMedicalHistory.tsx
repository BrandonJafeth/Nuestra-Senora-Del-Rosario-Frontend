import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useMedicalHistoryById } from "../../hooks/useMedicalHistoryById";
import { useUpdateMedicalHistory } from "../../hooks/useUpdateMedicalHistory";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import {  FaArrowLeft } from "react-icons/fa";
import Toast from "../common/Toast";
import { MedicalHistory } from "../../types/MedicalHistoryType";

const UpdateMedicalHistory: React.FC = () => {
  const { residentId, id_MedicalHistory } = useParams<{ residentId: string; id_MedicalHistory: string }>();
  const resident_Id = Number(residentId);
  const history_Id = Number(id_MedicalHistory);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm<Partial<MedicalHistory>>();
  const mutation = useUpdateMedicalHistory();
  const { data: medicalHistory, isLoading, error } = useMedicalHistoryById(resident_Id);

  // Estado para manejar mensajes del Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info");

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
          setToastMessage("Historial médico actualizado con éxito!");
          setToastType("success");
          setTimeout(() => navigate(`/dashboard/historial-medico/${resident_Id}`), 3000);
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
        <h2 className="text-2xl font-bold">Actualizar Historial Médico</h2>
      </div>

      {/* Componente Toast */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 🔹 Diagnóstico */}
        <div>
          <label className="block text-lg font-semibold mb-2">Diagnóstico</label>
          <textarea
            {...register("diagnosis")}
            rows={3}
            className="w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el diagnóstico del paciente..."
            required
          />
        </div>

        {/* 🔹 Tratamiento */}
        <div>
          <label className="block text-lg font-semibold mb-2">Tratamiento</label>
          <textarea
            {...register("treatment")}
            rows={3}
            className="w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el tratamiento a seguir..."
            required
          />
        </div>

        {/* 🔹 Observaciones */}
        <div>
          <label className="block text-lg font-semibold mb-2">Observaciones</label>
          <textarea
            {...register("observations")}
            rows={3}
            className="w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese observaciones adicionales..."
            required
          />
        </div>

        {/* 🔹 Botones */}
        <div className="flex justify-center gap-5 mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={mutation.isLoading}
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
