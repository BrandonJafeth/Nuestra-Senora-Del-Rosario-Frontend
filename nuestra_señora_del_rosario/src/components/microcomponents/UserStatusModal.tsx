import { useState } from 'react';
import { useUpdateUserStatus } from '../../hooks/useConfigUser';
import ConfirmationModal from '../microcomponents/ConfirmationModal';

interface UserStatusModalProps {
  userId: number;
  currentStatus: boolean;
  onClose: () => void;
}

const UserStatusModal: React.FC<UserStatusModalProps> = ({ userId, currentStatus, onClose }) => {
  const [isActive, setIsActive] = useState(currentStatus);
  const { updateUserStatus, isLoading, error } = useUpdateUserStatus();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Función para abrir el modal de confirmación
  const handleSaveClick = () => {
    setShowConfirmation(true);
  };

  // Función para confirmar la edición y actualizar el estado del usuario
  const handleConfirmEdit = async () => {
    await updateUserStatus(userId, { isActive });
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      {/* Modal para cambiar el estado */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Actualizar Estado del Usuario</h2>

          <label className="block mb-2 font-medium">Estado del Usuario</label>
          <select
            value={isActive ? 'true' : 'false'}
            onChange={(e) => setIsActive(e.target.value === 'true')}
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
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

          {error && <p className="text-red-500 mt-2">Error al actualizar el estado.</p>}
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
