import { Specialty } from "../types/SpecialityType";
import ApiService from "./GenericService/ApiService";

class SpecialtyService extends ApiService<Specialty> {
    public getAllSpecialties() {
        return this.getAll('/Specialty');
    }
}

const specialtyService = new SpecialtyService();
export default specialtyService;
