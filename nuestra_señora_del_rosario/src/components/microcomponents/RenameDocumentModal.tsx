import React, { useEffect } from 'react';
import { useRenameFile } from '../../hooks/useRenameFile';
import Toast from '../common/Toast';
import { useToast } from '../../hooks/useToast';

interface RenameDocumentModalProps {
  isOpen: boolean;
  document: { id: string; name: string };
  onClose: () => void;
}

const RenameDocumentModal: React.FC<RenameDocumentModalProps> = ({ isOpen, document, onClose }) => {
  const [newName, setNewName] = React.useState(document?.name || '');
  const { renameFileMutation, toast } = useRenameFile();
  const {message, showToast, type} = useToast();

  useEffect(() => {
    if (document) setNewName(document.name);
  }, [document]);

  const handleRename = () => {
    renameFileMutation.mutate({ fileId: document.id, newName });
    showToast("Se ha renombrado el archivo exitosamente", "success")
    setTimeout(() => onClose(), 2000);
  };

  if (!isOpen || !document) return null;

  return (
    <>
     {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Renombrar documento</h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded-md w-full p-2 mb-4"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleRename}
              disabled={renameFileMutation.isLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
            >
              {renameFileMutation.isLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <Toast message={message} type={type} />
    </>
  );
};

export default RenameDocumentModal;
