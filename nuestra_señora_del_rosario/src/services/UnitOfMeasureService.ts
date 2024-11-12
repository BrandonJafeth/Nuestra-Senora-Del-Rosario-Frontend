// FILE: services/UnitOfMeasureService.ts
import { UnitOfMeasure } from '../types/UnitOfMeasureType';
import ApiService from './GenericService/ApiService';

class UnitOfMeasureService extends ApiService<UnitOfMeasure> {
  constructor() {
    super();
  }

  getAllUnits() {
    return this.getAll('/UnitOfMeasure');
  }
}

export default new UnitOfMeasureService();
