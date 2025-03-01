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

  public createUnit(unit: UnitOfMeasure) {
    return this.create('/UnitOfMeasure', unit);
  }

  public updateUnit(id: number, unit: UnitOfMeasure) {
    return this.update('/UnitOfMeasure', id, unit);
  }

  public deleteUnit(id: number) {
    return this.delete('/UnitOfMeasure', id);
  }
}

export default new UnitOfMeasureService();
