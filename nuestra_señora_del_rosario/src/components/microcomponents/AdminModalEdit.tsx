import React, { useState, useEffect } from "react";

interface AdminModalEditProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (updatedValue: string) => void;
  initialValue: string;
}

const AdminModalEdit: React.FC<AdminModalEditProps> = ({ isOpen, title, onClose, onSave, initialValue }) => {
  const [updatedValue, setUpdatedValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setUpdatedValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <input
          type="text"
          value={updatedValue}
          onChange={(e) => setUpdatedValue(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Editar nombre"
        />
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={() => onSave(updatedValue)}>
            Confirmar
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModalEdit;
