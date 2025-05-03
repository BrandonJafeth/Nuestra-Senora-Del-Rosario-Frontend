import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const AdminModalAdd: React.FC<ModalProps> = ({ isOpen, title,  children, onClose }) => {
  if (!isOpen) return null;
  if (!onClose) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        {children} 
      </div>
    </div>
  );
};

export default AdminModalAdd;
