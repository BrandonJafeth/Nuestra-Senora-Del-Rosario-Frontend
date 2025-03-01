import { Specialty } from "../types/SpecialityType";
import ApiService from "./GenericService/ApiService";

class SpecialtyService extends ApiService<Specialty> {
    public getAllSpecialties() {
        return this.getAll('/Specialty');
    }

    public createSpecialty(data: Specialty) {
        return this.create('/Specialty', data);
    }

    public deleteSpecialty(id: number) {
        return this.delete('/Specialty', id);
    }
}

const specialtyService = new SpecialtyService();
export default specialtyService;
