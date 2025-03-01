
import { useMutation } from "react-query";
import galleryService from "../services/GalleryService";

export const useDeleteImage = () => {
  return useMutation(async (id_GalleryItem: number) => {
    return await galleryService.deleteGalleryItem(id_GalleryItem);
  });
};
