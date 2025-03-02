
import { useQuery } from "react-query";
import ApiService from "../services/GenericService/ApiService";
import { Gallery } from "../types/GalleryType";

const apiService = new ApiService<Gallery>();

export const useGallery = () => {
  return useQuery<Gallery[], Error>(
    ["GalleryItem"],
    async () => {
      const response = await apiService.getAll("GalleryItem");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de la galería no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
        id_GalleryItem: item.id_GalleryItem ?? 0,
        id_GalleryCategory: item.id_GalleryCategory ?? 0,
        gallery_Image_Url: item.gallery_Image_Url || "",
      }));
    },
    {
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      cacheTime: 10 * 60 * 1000, // Almacenar en caché por 10 minutos
    }
  );
};
