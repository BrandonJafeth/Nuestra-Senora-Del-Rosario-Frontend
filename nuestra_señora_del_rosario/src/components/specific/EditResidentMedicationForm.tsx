import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateResidentMedication } from "../../hooks/useUpdateResidentMedication";
import { useResidentInfoById } from "../../hooks/useResidentInfoById";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { ResidentMedication } from "../../types/ResidentMedicationType";
import Toast from "../common/Toast";
import { useThemeDark } from "../../hooks/useThemeDark";

const EditResidentMedicationForm: React.FC = () => {
  const { id, id_ResidentMedication } = useParams<{ id: string; id_ResidentMedication: string }>(); 
  const residentId = Number(id);
  const residentMedicationId = Number(id_ResidentMedication);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm<Partial<ResidentMedication>>();
  const mutation = useUpdateResidentMedication();
  const { data: resident, isLoading, error } = useResidentInfoById(residentId);
  
  const { isDarkMode } = useThemeDark();

  // Estado para manejar Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info");

  // Estado para almacenar el nombre del medicamento y la fecha de inicio
  const [medicationName, setMedicationName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");

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
        setValue("endDate", medicationToEdit.endDate ? medicationToEdit.endDate.split("T")[0] : "");
        setValue("notes", medicationToEdit.notes);

        // Guardar el nombre del medicamento en el estado
        setMedicationName(medicationToEdit.name_MedicamentSpecific || "Desconocido");

        // Formatear la fecha de inicio
        const formattedStartDate = medicationToEdit.startDate 
          ? medicationToEdit.startDate.split("T")[0] 
          : new Date().toISOString().split("T")[0];

        setValue("startDate", formattedStartDate);
        setStartDate(formattedStartDate);
      }
    }
  }, [resident, residentMedicationId, residentId, setValue]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar la información.</p>;

  const onSubmit = (data: Partial<ResidentMedication>) => {
    mutation.mutate(
      { id: residentMedicationId, data },
      {
        onSuccess: () => {
          setToastMessage("Medicamento actualizado con éxito!");
          setToastType("success");
          setTimeout(() => navigate(`/dashboard/residente-info/${residentId}`), 3000);
        },
        onError: () => {
          setToastMessage("Hubo un error al actualizar el medicamento.");
          setToastType("error");
        },
      }
    );
  };

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-md ${isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Medicamento</h2>

      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Medicamento Asignado (solo visual) */}
        <div>
          <label className="block mb-1">Medicamento Asignado</label>
          <input
            type="text"
            value={medicationName}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
            disabled
          />
          <input type="hidden" {...register("id_MedicamentSpecific")} />
        </div>

        {/* Dosis Prescrita */}
        <div>
          <label className="block mb-1">Dosis prescrita</label>
          <input
            type="number"
            {...register("prescribedDose")}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
        </div>

        {/* Fecha de Inicio (no editable) */}
        <div>
          <label className="block mb-1">Fecha de inicio</label>
          <input
            type="date"
            value={startDate}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
            disabled
          />
          <input type="hidden" {...register("startDate")} value={startDate} />
        </div>

        {/* Fecha de Fin */}
        <div>
          <label className="block mb-1">Fecha de fin</label>
          <input
            type="date"
            {...register("endDate")}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block mb-1">Notas</label>
          <textarea
            {...register("notes")}
            className={`w-full p-2 border rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
          ></textarea>
        </div>

        <div className="flex justify-center gap-5 mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Guardando..." : "Actualizar"}
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

export default EditResidentMedicationForm;
