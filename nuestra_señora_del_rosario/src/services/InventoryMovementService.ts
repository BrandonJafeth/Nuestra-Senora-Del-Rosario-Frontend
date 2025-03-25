// FILE: src/services/InventoryService.ts
import ApiService from './GenericService/ApiService';
import { InventoryMovement } from '../types/InventoryMovement';
import Cookies from 'js-cookie';

class InventoryService extends ApiService<InventoryMovement> {
  constructor() {
    super();
  }

  public createInventoryMovement(data: InventoryMovement) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Usamos createWithHeaders para enviar el token en los headers
    return this.postWithHeaders('/Inventory', data, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const inventoryMovementService = new InventoryService();
export default inventoryMovementService;
