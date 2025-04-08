import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useChangePassword } from "../../hooks/useChangePassword";
import LoadingSpinner from "./LoadingSpinner";
import Toast from "../common/Toast";
import ConfirmationModal from "./ConfirmationModal"; // 🔹 Modal de confirmación
import { useThemeDark } from "../../hooks/useThemeDark";
import { useToast } from "../../hooks/useToast";

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Estado del modal de confirmación

  // Usamos useToast para gestionar los mensajes
  const { showToast, message, type } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de la contraseña actual: que no esté vacía y tenga al menos 6 caracteres
    if (!currentPassword.trim()) {
      showToast("La contraseña actual es requerida", "error");
      return;
    }
    if (currentPassword.length < 6) {
      showToast("La contraseña actual debe tener al menos 6 caracteres", "error");
      return;
    }

    // Validación de la nueva contraseña: que no esté vacía, tenga al menos 6 caracteres y sea distinta de la actual
    if (!newPassword.trim()) {
      showToast("La nueva contraseña es requerida", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("La nueva contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    if (newPassword === currentPassword) {
      showToast("La nueva contraseña debe ser diferente a la actual", "error");
      return;
    }

    // Validación de que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      showToast("❌ Las contraseñas no coinciden", "error");
      return;
    }

    // Abre el modal de confirmación antes de ejecutar el cambio
    setIsConfirmOpen(true);
  };

  // Confirmar el cambio de contraseña
  const handleConfirm = async () => {
    setIsConfirmOpen(false); // Cierra el modal de confirmación

    await changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
      id_User: 0,
      dni: 0,
      email: "",
      fullName: "",
      password: "",
      is_Active: false,
      isActive: false,
      roles: [],
      id_Role: 0,
    });
  };

  // Manejar el éxito o error del cambio de contraseña mediante Toast
  useEffect(() => {
    if (success) {
      showToast("✅ Contraseña actualizada correctamente", "success");

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
            .map(
              ([field, messages]) =>
                `❌ ${field}: ${(messages as string[]).join(", ")}`
            )
            .join("\n");
          showToast(formattedErrors, "error");
        } else {
          showToast(`❌ ${errorObj.title || "Error desconocido"}`, "error");
        }
      } catch {
        showToast(`❌ ${error}`, "error");
      }
    }
  }, [success, error, showToast, onClose]);

  // Limpiar el formulario y cerrar el modal correctamente
  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
        <h2 className="text-2xl font-bold text-center mb-4">
          Cambiar Contraseña
        </h2>

        {/* Mostrar el Toast si hay un mensaje */}
        {message && <Toast message={message} type={type || "error"} />}

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
            <label className="block text-lg">Nueva contraseña</label>
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
            <label className="block text-lg">Confirmar nueva contraseña</label>
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
              type="submit"
              className={`px-4 py-2 text-white rounded-lg shadow-md transition duration-200 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Guardar"}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
              onClick={handleClose}
            >
              Cancelar
            </button>
          </div>
        </form>

        
        {isConfirmOpen && (
          <ConfirmationModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirm}
            title="Confirmar cambio de contraseña"
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
