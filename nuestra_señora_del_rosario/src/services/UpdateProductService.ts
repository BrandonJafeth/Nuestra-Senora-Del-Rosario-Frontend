// services/UpdateProductService.ts
import { ProductPatchType } from '../types/ProductPatchType';
import ApiService from './GenericService/ApiService';

class UpdateProductService extends ApiService<ProductPatchType> {
  constructor() {
    super();
  }

  updateProduct(id: number, patchData: Partial<ProductPatchType>) {
    return this.patch(`/Product`, id, patchData);
  }
}

export default new UpdateProductService();
