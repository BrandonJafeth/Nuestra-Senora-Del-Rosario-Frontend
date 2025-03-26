import axios, { AxiosResponse } from "axios";
import { InventoryMovement } from "../types/InventoryMovement";
import { useMutation, useQueryClient } from "react-query";
import Cookies from "js-cookie";

const API_URL = "https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api/Inventory"; 

export const useCreateInventoryMovement = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, Error, InventoryMovement[]>(
    async (movements: InventoryMovement[]) => {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No se encontró un token de autenticación");

      return await axios.post(API_URL, movements, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
    },
    {
      onSuccess: () => {
        // Invalida la query que trae los movimientos de inventario para actualizar la lista
        queryClient.invalidateQueries({ queryKey: ['productsByCategory'] });
      },
    }
  );
};
