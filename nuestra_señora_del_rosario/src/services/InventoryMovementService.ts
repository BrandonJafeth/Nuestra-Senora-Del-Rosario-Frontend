// services/InventoryService.ts
import ApiService from './GenericService/ApiService';
import { InventoryMovement } from '../types/InventoryMovement';

class InventoryService extends ApiService<InventoryMovement> {
  constructor() {
    super();
  }

  public createInventoryMovement(data: InventoryMovement) {
    return this.create('/Inventory', data);
  }
}

const inventoryMovementService = new InventoryService();
export default inventoryMovementService;
