// src/components/modals/UploadDocumentModal.tsx

import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { useFileUpload } from '../../hooks/useFileUpload';


interface UploadDocumentModalProps {
  isOpen: boolean;
  cedula: string;
  onClose: () => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, cedula, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate, isLoading, isError, isSuccess, error } = useFileUpload();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedFile) {
      showToast('Seleccione un archivo para subir', 'error');
      return;
    }
  
    mutate({ cedula, file: selectedFile });
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Subir Documentos</h2>
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} className="mb-4" />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isLoading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
        </form>
        {isError && (
          <p className="text-red-500 mt-2">
            Error al subir documento: {String(error)}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-500 mt-2">
            Documento subido con éxito!
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadDocumentModal;
