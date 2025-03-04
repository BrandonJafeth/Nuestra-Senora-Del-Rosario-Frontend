import { useState, useEffect } from "react";
import { useUpdateUserStatus } from "../../hooks/useConfigUser";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import Toast from "../common/Toast";
import LoadingSpinner from "./LoadingSpinner";

interface UserStatusModalProps {
  userId: number;
  currentStatus: boolean;
  onClose: () => void;
}

const UserStatusModal: React.FC<UserStatusModalProps> = ({ userId, currentStatus, onClose }) => {
  const [isActive, setIsActive] = useState(currentStatus);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);

  const mutation = useUpdateUserStatus(); // 🔹 Usamos React Query

  const handleSaveClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmEdit = () => {
    setShowConfirmation(false);

    mutation.mutate(
      { userId, status: { isActive } },
      {
        onSuccess: () => {
          setToastMessage("Estado del usuario actualizado correctamente.");
          setToastType("success");
          setTimeout(onClose, 2000); // Cierra el modal después de 2 segundos
        },
        onError: (error) => {
          const errorMessage = (error as any).response?.data?.message || "Error al actualizar el estado del usuario.";
          setToastMessage(errorMessage);
          setToastType("error");
        },
      }
    );
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <>
      {toastMessage && <Toast message={toastMessage} type={toastType || "error"} />}

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
              onClick={handleSaveClick}
              disabled={mutation.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {mutation.isLoading ? <LoadingSpinner /> : "Guardar"}
            </button>
          </div>

          {mutation.isError && <p className="text-red-500 mt-2">❌ {toastMessage}</p>}
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmEdit}
          title="Confirmar Cambio de Estado"
          message="¿Estás seguro de que quieres cambiar el estado de este usuario?"
          confirmText="Confirmar"
        />
      )}
    </>
  );
};

export default UserStatusModal;
