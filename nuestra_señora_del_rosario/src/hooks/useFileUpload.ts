// src/hooks/useFileUpload.ts

import { useMutation } from 'react-query';
import fileUploadService from '../services/FileUploadService';

export function useFileUpload() {
  return useMutation(({ cedula, file }: { cedula: string; file: File }) =>
    fileUploadService.uploadFile(cedula, file)
  );
}
