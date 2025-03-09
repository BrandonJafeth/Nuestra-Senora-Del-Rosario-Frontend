import { useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import fileUploadService from '../services/FileUploadService';

export const useRenameFile = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const renameFileMutation = useMutation(
    ({ fileId, newName }: { fileId: string; newName: string }) =>
      fileUploadService.renameFile(fileId, newName),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['residentDocuments']);
        showToast('✅ Archivo renombrado correctamente!', 'success');
        setTimeout(() => queryClient.invalidateQueries(['residentDocuments']), 2000);
      },
      onError: () => {
        showToast('❌ Error al renombrar el archivo', 'error');
        setTimeout(() => queryClient.invalidateQueries(['residentDocuments']), 2000);
      },
    }
  );

  return { renameFileMutation, toast };
};
