// hooks/useCreateInventoryMovement.ts
import { useMutation } from 'react-query';
import { InventoryMovement } from '../types/InventoryMovement';
import inventoryMovementService from '../services/InventoryMovementService';

export const useCreateInventoryMovement = () => {
  return useMutation((data: InventoryMovement) => inventoryMovementService.createInventoryMovement(data));
};
