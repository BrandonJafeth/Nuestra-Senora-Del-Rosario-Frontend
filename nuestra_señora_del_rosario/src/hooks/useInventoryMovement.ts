
import axios, { AxiosResponse } from "axios";
import { InventoryMovement } from "../types/InventoryMovement";
import { useMutation } from "react-query";

const API_URL = "https://nuestra-senora-del-rosario-backend.onrender.com/api/Inventory"; // ⚠️ Reemplaza con tu URL real

export const useCreateInventoryMovement = () => {
  return useMutation<AxiosResponse<any>, Error, InventoryMovement[]>({
    mutationFn: async (movements: InventoryMovement[]) => {
      return await axios.post(API_URL, movements, {
        headers: { "Content-Type": "application/json" },
      });
    }
  });
};
