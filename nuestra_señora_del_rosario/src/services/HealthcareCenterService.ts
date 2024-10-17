import { HealthcareCenter } from "../types/HealthcareCenter";
import ApiService from "./GenericService/ApiService";

class HealthcareCenterService extends ApiService<HealthcareCenter> {
    public getAllHealthcareCenters() {
        return this.getAll('/HealthcareCenter');
    }
}

const healthcareCenterService = new HealthcareCenterService();
export default healthcareCenterService;
