import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useChangePassword } from "../../hooks/useChangePassword";
import LoadingSpinner from "./LoadingSpinner";
import Toast from "../common/Toast";
import ConfirmationModal from "./ConfirmationModal"; // 🔹 Se importa el modal de confirmación
import { useThemeDark } from "../../hooks/useThemeDark";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useThemeDark();
  const { changePassword, error, isLoading, success } = useChangePassword();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Estado del modal de confirmación

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setToastMessage("❌ Las contraseñas no coinciden");
      setToastType("error");
      return;
    }

    setIsConfirmOpen(true); // 🔹 Se abre el modal de confirmación antes de cambiar la contraseña
  };

  // Confirmar el cambio de contraseña
  const handleConfirm = async () => {
    setIsConfirmOpen(false); // Cerrar modal de confirmación antes de ejecutar acción

    await changePassword({
      currentPassword, newPassword, confirmPassword,
      id_User: 0,
      dni: 0,
      email: "",
      fullName: "",
      password: "",
      is_Active: false,
      isActive: false,
      roles: []
    });
  };

  // Manejar éxito o error en el Toast
  useEffect(() => {
    if (success) {
      setToastMessage("✅ Contraseña actualizada correctamente");
      setToastType("success");

      setTimeout(() => {
        onClose();
        window.location.reload(); // 🔄 Recargar la página después de cerrar
      }, 2000);
    }

    if (error) {
      try {
        const errorObj = JSON.parse(error);
        if (errorObj.errors) {
          const formattedErrors = Object.entries(errorObj.errors)
            .map(([field, messages]) => `❌ ${field}: ${(messages as string[]).join(", ")}`)
            .join("\n");

          setToastMessage(formattedErrors);
          setToastType("error");
        } else {
          setToastMessage(`❌ ${errorObj.title || "Error desconocido"}`);
          setToastType("error");
        }
      } catch {
        setToastMessage(`❌ ${error}`);
        setToastType("error");
      }
    }
  }, [success, error]);

  // Limpiar el formulario y cerrar el modal correctamente
  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setToastMessage(null);
    setToastType(null);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        className={`p-6 rounded-xl shadow-xl w-[500px] mx-auto mt-20 relative z-40 ${
          isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Cambiar Contraseña</h2>

        {/* Toasts para mostrar errores o confirmaciones */}
        {toastMessage && <Toast message={toastMessage} type={toastType || "error"} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contraseña Actual */}
          <div>
            <label className="block text-lg">Contraseña Actual</label>
            <input
              type="password"
              className="w-full p-2 rounded-md shadow-sm border border-gray-300 text-black"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label className="block text-lg">Nueva Contraseña</label>
            <input
              type="password"
              className="w-full p-2 rounded-md shadow-sm border border-gray-300 text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div>
            <label className="block text-lg">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              className="w-full p-2 rounded-md shadow-sm border border-gray-300 text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg shadow-md transition duration-200 ${
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Guardar"}
            </button>
          </div>
        </form>
      {/* 🔹 Modal de Confirmación con un z-index superior */}
      {isConfirmOpen && (
        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          title="Confirmar Cambio de Contraseña"
          message="¿Estás seguro de que quieres cambiar tu contraseña?"
          confirmText="Confirmar"
          cancelText="Cancelar"
          isLoading={isLoading}
        />
      )}
      </Modal>

    </>
  );
};

export default ChangePasswordModal;
