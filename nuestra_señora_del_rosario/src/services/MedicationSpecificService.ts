
import { MedicationSpecific } from '../types/MedicationSpecificType';
import ApiService from './GenericService/ApiService'; 

class MedicationSpecificService extends ApiService<MedicationSpecific> {
  constructor() {
    super(); 
  }

  public getAllMedicationSpecific = async () => {
    return await this.getAll('/MedicationSpecific');
  };
  

  public getMedicationSpecificById(id: number) {
    return this.getOne('/MedicationSpecific', id);
  }

  public createMedicationSpecific(data: MedicationSpecific) {
    return this.create('/MedicationSpecific', data);
  }

  public updateMedicationSpecific(id: number, data: Partial<MedicationSpecific>) {
    return this.patch(`/MedicationSpecific/${id}`, id, data); 
  }

  public deleteMedicationSpecific(id: number) {
    return this.delete('/MedicationSpecific', id);
  }
}

const medicationSpecificService = new MedicationSpecificService();
export default medicationSpecificService;
