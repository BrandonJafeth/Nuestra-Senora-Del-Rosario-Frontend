import Cookies from "js-cookie";
import ApiService from "./GenericService/ApiService";
import { VoluntarieType } from "../types/VoluntarieType";

class VolunteerSectionService extends ApiService<VoluntarieType> {
  constructor() {
    super();
  }

  // GET /api/VoluntarieType
  public getAllVolunteerTypes() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<VoluntarieType[]>("/VoluntarieType", {
      Authorization: `Bearer ${token}`,
    });
  }
}

const volunteerSectionServiceInstance = new VolunteerSectionService();
export default volunteerSectionServiceInstance;
