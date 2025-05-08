import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useUpdateUserProfile } from "../../hooks/useUpdateUserProfile";
import { User } from "../../types/UserType";
import LoadingSpinner from "./LoadingSpinner";
import ConfirmationModal from "./ConfirmationModal";
import Toast from "../common/Toast";
import { useToast } from "../../hooks/useToast";
import { useThemeDark } from "../../hooks/useThemeDark";

// Set the app element for accessibility
if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { isDarkMode } = useThemeDark();
  const { mutate: updateUserProfile, isLoading, isSuccess } =
    useUpdateUserProfile();
  const { showToast, message, type } = useToast();

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // When profile update succeeds, show toast and close modal
  useEffect(() => {
    if (isSuccess) {
      showToast("✅ Perfil actualizado correctamente", "success");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    }
  }, [isSuccess, showToast, onClose]);

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    updateUserProfile(
      { fullName, email },
      {
        onSuccess: () => {
          showToast("✅ Perfil actualizado correctamente", "success");
        },
        onError: () => {
          showToast("❌ Error al actualizar el perfil", "error");
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If no changes were made, show warning toast and abort
    if (fullName === user.fullName && email === user.email) {
      showToast("⚠️ Debes realizar cambios antes de guardar", "warning");
      return;
    }

    // Otherwise open the confirmation dialog
    setIsConfirmOpen(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`p-6 rounded-xl shadow-xl w-[500px] mx-auto relative z-50 ${
        isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"
      }`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center overflow-y-auto z-[100]"
      contentLabel="Actualizar perfil"
    >
      <h2 className="text-2xl font-bold text-center mb-4">
        Actualizar perfil
      </h2>

      {/* Renderizamos el toast manager */}
      <Toast message={message} type={type} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre de Usuario */}
        <div>
          <label className="block text-lg">Nombre de Usuario</label>
          <input
            type="text"
            className="w-full p-2 rounded-md shadow-sm border border-gray-300 text-black"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            onClick={onClose}
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
          title="Confirmar cambio de perfil"
          message="¿Estás seguro de que quieres actualizar tu perfil?"
          confirmText="Confirmar"
          cancelText="Cancelar"
          isLoading={isLoading}
        />
      )}
    </Modal>
  );
};

export default UserProfileModal;
