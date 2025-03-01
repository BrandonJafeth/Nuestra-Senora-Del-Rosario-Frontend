
import { useQuery } from "react-query";
import ApiService from "../services/GenericService/ApiService";
import { GalleryCategory } from "../types/GalleryCategoryType";

const apiService = new ApiService<GalleryCategory>();

export const useGalleryCategories = () => {
  return useQuery<GalleryCategory[], Error>(
    ["GalleryCategory"],
    async () => {
      const response = await apiService.getAll("GalleryCategory");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de la galería no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
        id_GalleryCategory: item.id_GalleryCategory ?? 0,
        name_Gallery_Category: item.name_Gallery_Category || "",
      }));
    },
    {
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      cacheTime: 10 * 60 * 1000, // Almacenar en caché por 10 minutos
    }
  );
};
