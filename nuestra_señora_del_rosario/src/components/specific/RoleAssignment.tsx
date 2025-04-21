import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAssignRole } from '../../hooks/useAssignRole';
import { useThemeDark } from '../../hooks/useThemeDark';
import Toast from '../common/Toast';
import RoleDropdown from '../microcomponents/RoleDrodown';

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

const RoleAssignment: React.FC<AssignRoleModalProps> = ({ isOpen, onClose, userId, userName }) => {
  const { isDarkMode } = useThemeDark();
  const [idRole, setIdRole] = useState<number | null>(null);
  const { mutate, isLoading, isError, isSuccess, error, data } = useAssignRole();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && idRole) {
      mutate(
        { id_User: userId, id_Role: idRole, message: 'Assigning role' },
        {
          onSuccess: (response) => {
            setToastMessage(response.message); // Mensaje del backend
            setToastType('success');
            setTimeout(onClose, 2000); // Cierra el modal después de 2 segundos
          },
          onError: (err: any) => {
            setToastMessage(err.response?.data?.message || 'Error al asignar rol');
            setToastType('error');
          }
        }
      );
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      setToastMessage(data.message); // Mensaje del backend en caso de éxito
      setToastType('success');
    }
    if (isError && error) {
      setToastMessage(error.message || 'Error al asignar rol');
      setToastType('error');
    }
  }, [isSuccess, isError, data, error]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`p-6 rounded-xl shadow-xl w-[500px] mx-auto mt-20 ${
        isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-900'
      }`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Asignar Rol</h2>

      {/* Mensajes con Toast */}
      {toastMessage && <Toast message={toastMessage} type={toastType || 'error'} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Usuario */}
        <div>
          <label className="block text-lg">Usuario</label>
          <input
            type="text"
            className="w-full p-2 rounded-md shadow-sm bg-gray-200 text-gray-800"
            value={userName}
            disabled
          />
        </div>

        {/* Selección de Rol */}
        <div>
          <label className="block text-lg">Seleccionar rol</label>
          <RoleDropdown value={idRole || 0} onChange={setIdRole} />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-lg shadow-md transition duration-200 ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Asignando...' : 'Asignar'}
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
    </Modal>
  );
};

export default RoleAssignment;
