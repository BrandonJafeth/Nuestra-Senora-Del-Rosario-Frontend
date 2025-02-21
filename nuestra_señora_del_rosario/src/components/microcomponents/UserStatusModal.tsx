import { useState, useEffect } from "react";
import { useUpdateUserStatus } from "../../hooks/useConfigUser";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast"; // 🔹 Se importa el Toast
import { AxiosError } from "axios";
import LoadingSpinner from "./LoadingSpinner";

interface UserStatusModalProps {
  userId: number;
  currentStatus: boolean;
  onClose: () => void;
}

const UserStatusModal: React.FC<UserStatusModalProps> = ({ userId, currentStatus, onClose }) => {
  const [isActive, setIsActive] = useState(currentStatus);
  const { updateUserStatus, isLoading, error } = useUpdateUserStatus();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);
  
  const getErrorMessage = (error: unknown): string => {
    if (!error) return "Ocurrió un error inesperado.";
  
    if (error instanceof AxiosError) {
      // Intentamos obtener el mensaje de distintas fuentes
      return (
        (error.response?.data as { message?: string })?.message || 
        JSON.stringify(error.response?.data) || 
        error.message || 
        "Error desconocido."
      );
    }
  
    // Si error no es un AxiosError, lo convertimos a string
    return typeof error === "string" ? error : JSON.stringify(error);
  };
  const errorMessage = getErrorMessage(error);

  
  // Función para abrir el modal de confirmación
  const handleSaveClick = () => {
    setShowConfirmation(true);
  };

  // Función para confirmar la edición y actualizar el estado del usuario
  const handleConfirmEdit = async () => {
    setShowConfirmation(false);

    try {
      await updateUserStatus(userId, { isActive });
      setToastMessage("Estado del usuario actualizado correctamente.");
      setToastType("success");
      setTimeout(onClose, 2000); // Cierra el modal después de 2 segundos
    } catch {
      setToastMessage("Error al actualizar el estado del usuario.");
      setToastType("error");
    }
  };

  // Cerrar el toast automáticamente después de unos segundos
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <>
      {/* Mostrar el Toast si hay mensaje */}
      {toastMessage && <Toast message={toastMessage} type={toastType || "error"} />}

      {/* Modal para cambiar el estado */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Actualizar Estado del Usuario</h2>

          <label className="block mb-2 font-medium">Estado del Usuario</label>
          <select
            value={isActive ? "true" : "false"}
            onChange={(e) => setIsActive(e.target.value === "true")}
            className="w-full p-2 border rounded-md"
          >
            <option value="true">Sí (Activo)</option>
            <option value="false">No (Inactivo)</option>
          </select>

          <div className="flex justify-end mt-4 space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded-md">
              Cancelar
            </button>
            <button
              onClick={handleSaveClick} // En vez de actualizar directamente, abrimos el modal de confirmación
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {isLoading ? <LoadingSpinner/> : "Guardar"}
            </button>
          </div>

          {/* Mostrar error en el modal si hay */}
          {error && <p className="text-red-500 mt-2">❌ {errorMessage}</p>}
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmEdit}
          title="Confirmar Cambio de Estado"
          message={`¿Estás seguro de que quieres cambiar el estado de este usuario?`}
          confirmText="Confirmar"
        />
      )}
    </>
  );
};

export default UserStatusModal;
