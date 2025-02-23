import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateResidentMedication } from "../../hooks/useUpdateResidentMedication";
import { useResidentInfoById } from "../../hooks/useResidentInfoById";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { ResidentMedication } from "../../types/ResidentMedicationType";
import Toast from "../common/Toast";

const EditResidentMedicationForm: React.FC = () => {
  const { id, id_ResidentMedication } = useParams<{ id: string; id_ResidentMedication: string }>(); 
  const residentId = Number(id);
  const residentMedicationId = Number(id_ResidentMedication);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm<Partial<ResidentMedication>>();
  const mutation = useUpdateResidentMedication();
  const { data: resident, isLoading, error } = useResidentInfoById(residentId);

  // Estado para manejar los mensajes del Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info");

  // Estado para almacenar el nombre del medicamento
  const [medicationName, setMedicationName] = useState<string>("");

  useEffect(() => {
    if (resident && resident.medications) {
      const medicationToEdit = resident.medications.find(
        (m) => m.id_ResidentMedication === residentMedicationId
      );

      if (medicationToEdit) {
        setValue("id_ResidentMedication", medicationToEdit.id_ResidentMedication);
        setValue("id_Resident", residentId);
        setValue("id_MedicamentSpecific", medicationToEdit.id_MedicamentSpecific);
        setValue("prescribedDose", medicationToEdit.prescribedDose);
        setValue("startDate", medicationToEdit.startDate?.split("T")[0] || ""); // Fecha registrada
        setValue("endDate", medicationToEdit.endDate ? medicationToEdit.endDate.split("T")[0] : "");
        setValue("notes", medicationToEdit.notes);

        // Suponiendo que `medicationToEdit.id_MedicamentSpecific` es el ID del medicamento y tienes acceso a un array con los nombres
        setMedicationName(medicationToEdit.name_MedicamentSpecific || "Desconocido"); // Asegurar que el nombre se carga
      }
    }
  }, [resident, residentMedicationId, setValue]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar la información.</p>;

  const onSubmit = (data: Partial<ResidentMedication>) => {
    mutation.mutate(
      { id: residentMedicationId, data },
      {
        onSuccess: () => {
          setToastMessage("Medicamento actualizado con éxito!");
          setToastType("success");
          setTimeout(() => navigate(`/dashboard/residente-info/${residentId}`), 3000); // Redirige después del Toast
        },
        onError: () => {
          setToastMessage("Hubo un error al actualizar el medicamento.");
          setToastType("error");
        },
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Medicamento</h2>

      {/* Componente Toast */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre del Medicamento Asignado (Solo visual, se envía el ID) */}
        <div>
          <label className="block text-gray-700">Medicamento Asignado</label>
          <input
            type="text"
            value={medicationName} // Muestra el nombre del medicamento
            className="w-full px-3 py-2 border rounded-md bg-gray-200"
            disabled
          />
          <input type="hidden" {...register("id_MedicamentSpecific")} /> {/* Enviar el ID real */}
        </div>

        <div>
          <label className="block text-gray-700">Dosis Prescrita</label>
          <input
            type="number"
            {...register("prescribedDose")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">Fecha de Inicio</label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">Fecha de Fin</label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700">Notas</label>
          <textarea
            {...register("notes")}
            className="w-full px-3 py-2 border rounded-md"
          ></textarea>
        </div>

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

export default EditResidentMedicationForm;
