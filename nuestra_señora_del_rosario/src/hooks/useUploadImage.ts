
import { uploadToImgBB } from "../services/ImgBBService";
import galleryService from "../services/GalleryService";
import { useMutation } from "react-query";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async ({ file, category }: { file: File; category: number }) => {
      // 1️⃣ Subir la imagen a ImgBB
      const imageUrl = await uploadToImgBB(file);
      if (!imageUrl) throw new Error("Error al subir la imagen a ImgBB");

      // 2️⃣ Guardar la URL en la base de datos
      return await galleryService.addGalleryItem(category, imageUrl);
    }
  });
};
