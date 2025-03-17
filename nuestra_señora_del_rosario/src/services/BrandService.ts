


// services/BrandService.ts
import { BrandType } from '../types/BrandType';
import ApiService from './GenericService/ApiService';


class BrandService extends ApiService<BrandType> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  public getAllBrands() {
    return this.getAll('/Brand'); // Cambia la ruta según tu API
  }

  public getBrandById(id: number) {
    return this.getOne('/Brand', id); // Cambia la ruta según tu API
  }

  public createBrand(data: BrandType) {
    return this.create('/Brand', data); // Cambia la ruta según tu API
  }

  public updateBrand(id: number, data: Partial<BrandType>) {
    return this.patch(`/Brand/${id}`, id, data); // Cambia la ruta según tu API
  }

  public deleteBrand(id: number) {
    return this.delete('/Brand', id); // Cambia la ruta según tu API
  }
}

const brandService = new BrandService();
export default brandService;
