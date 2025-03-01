import { HealthcareCenter } from "../types/HealthcareCenter";
import ApiService from "./GenericService/ApiService";

class HealthcareCenterService extends ApiService<HealthcareCenter> {
    public getAllHealthcareCenters() {
        return this.getAll('/HealthcareCenter');
    }

    public createHealthcareCenter(data: HealthcareCenter) {
        return this.create('/HealthcareCenter', data);
      }

      public deleteHealthcareCenter(id: number) {
        return this.delete('/HealthcareCenter', id);
      }
    
}

const healthcareCenterService = new HealthcareCenterService();
export default healthcareCenterService;
