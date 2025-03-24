import axios, { AxiosResponse } from "axios";
import { InventoryMovement } from "../types/InventoryMovement";
import { useMutation } from "react-query";
import Cookies from "js-cookie";

const API_URL = "https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api/Inventory"; 

export const useCreateInventoryMovement = () => {
  return useMutation<AxiosResponse<any>, Error, InventoryMovement[]>({
    mutationFn: async (movements: InventoryMovement[]) => {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No se encontró un token de autenticación");
      
      return await axios.post(API_URL, movements, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
    }
  });
};
