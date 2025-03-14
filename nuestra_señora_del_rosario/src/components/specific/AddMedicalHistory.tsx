import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useMedicalHistory } from "../../hooks/useCreateMedicalHistory";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import Toast from "../common/Toast";

const AddMedicalHistoryForm: React.FC = () => {
  const { residentId } = useParams();
  const resident_Id = Number(residentId);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      id_Resident: resident_Id,
      diagnosis: "",
      treatment: "",
      observations: "",
    },
  });

  const mutation = useMedicalHistory();

  // 🔥 Estado para manejar los mensajes del Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // ✅ Manejador de envío del formulario
  const onSubmit = (data: any) => {
    mutation.mutate(data, {
      onSuccess: () => {
        setToastMessage("Historial médico agregado con éxito!");
        setToastType("success");
        reset(); // ✅ Resetea el formulario después del éxito
        setTimeout(() => navigate(`/dashboard/historial-medico/${resident_Id}`), 2000);
      },
      onError: () => {
        setToastMessage("Hubo un error al agregar el historial médico.");
        setToastType("error");
      },
    });
  };

  return (
    <div className="p-8 rounded-xl shadow-xl w-full max-w-3xl mx-auto bg-white text-gray-900">
      {/* 🔥 Componente Toast (solo si hay mensaje) */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Volver
        </button>
        <h2 className="text-2xl font-bold">Agregar Historial Médico</h2>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Diagnóstico */}
        <div>
          <label className="block text-lg font-semibold mb-2">Diagnóstico</label>
          <textarea
            {...register("diagnosis", { required: true })}
            rows={3}
            className="w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el diagnóstico del paciente..."
          />
        </div>

        {/* Tratamiento */}
        <div>
          <label className="block text-lg font-semibold mb-2">Tratamiento</label>
          <textarea
            {...register("treatment", { required: true })}
            rows={3}
            className="w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el tratamiento a seguir..."
          />
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-lg font-semibold mb-2">Observaciones</label>
          <textarea
            {...register("observations", { required: true })}
            rows={3}
            className="w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese observaciones adicionales..."
          />
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-5 mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center gap-2"
            disabled={mutation.isLoading}
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
