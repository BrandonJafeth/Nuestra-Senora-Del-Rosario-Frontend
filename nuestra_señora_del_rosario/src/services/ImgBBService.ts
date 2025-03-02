import axios from "axios";

const IMGBB_API_KEY = "b4921199d13d30a9b4e12ce3dfc180c0"; // 🔥 Reemplaza con tu API Key
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

/**
 * Sube una imagen a ImgBB y devuelve la URL de la imagen alojada.
 * @param file Archivo a subir
 * @returns URL de la imagen alojada en ImgBB o null si hay error
 */
export const uploadToImgBB = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", IMGBB_API_KEY);

  try {
    const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data.url; // 🔥 Retorna la URL de la imagen subida
  } catch (error) {
    console.error("🚨 Error al subir imagen a ImgBB", error);
    return null;
  }
};
