
import { MedicalHistory } from '../types/MedicalHistoryType';
import ApiService from './GenericService/ApiService'; 

class MedicalHistoryService extends ApiService<MedicalHistory> {
  constructor() {
    super(); 
  }

  public getAllMedicalHistories = async () => {
    return await this.getAll('/MedicalHistory');
  };
  

  public getMedicalHistoriesById(id: number) {
    return this.getOne('/MedicalHistory/resident', id);
  }

  public createMedicalHistories(data: MedicalHistory) {
    return this.create('/MedicalHistory', data);
  }

  public updateMedicalHistories(id: number, data: Partial<MedicalHistory>) {
    return this.putWithoutId(`/MedicalHistory/${id}`, data); 
  }

  public deleteMedicalHistories(id: number) {
    return this.delete('/MedicalHistory', id);
  }
}

const medicalHistorysService = new MedicalHistoryService();
export default medicalHistorysService;
