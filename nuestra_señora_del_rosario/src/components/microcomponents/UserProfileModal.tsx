import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useUpdateUserProfile } from "../../hooks/useUpdateUserProfile";
import { User } from "../../types/UserType";
import LoadingSpinner from "./LoadingSpinner";
import ConfirmationModal from "./ConfirmationModal";
import Toast from "../common/Toast";
import { useThemeDark } from "../../hooks/useThemeDark";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  const { isDarkMode } = useThemeDark();
  const { updateUserProfile, isLoading, success } = useUpdateUserProfile();
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Estado para Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);

  const handleConfirm = async () => {
    setIsConfirmOpen(false); // Cerrar modal de confirmación
    try {
      await updateUserProfile({ fullName, email });

      if (success) {
        setToastMessage("✅ Perfil actualizado correctamente");
        setToastType("success");
      }
    } catch (err) {
      setToastMessage("Error al actualizar el perfil");
      setToastType("error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  // Cierra el modal automáticamente después de mostrar el Toast
  useEffect(() => {
    if (success) {
      setToastMessage("Perfil actualizado correctamente");
      setToastType("success");

      // Espera 2 segundos antes de cerrar el modal
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    }
  }, [success, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`p-6 rounded-xl shadow-xl w-[500px] mx-auto mt-20 ${
        isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"
      }`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Actualizar Perfil</h2>

      {/* Toasts */}
      {toastMessage && <Toast message={toastMessage} type={toastType || "error"} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre de Usuario */}
        <div>
          <label className="block text-lg">Nombre de Usuario</label>
          <input
            type="text"
            className="w-full p-2 rounded-md shadow-sm border border-gray-300 text-black"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="block text-lg">Correo Electrónico</label>
          <input
            type="email"
            className="w-full p-2 rounded-md shadow-sm border border-gray-300 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
            onClick={onClose}
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
  );
};

export default UserProfileModal;
