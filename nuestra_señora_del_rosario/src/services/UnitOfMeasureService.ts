import Cookies from "js-cookie";
import { UnitOfMeasure } from "../types/UnitOfMeasureType";
import ApiService from "./GenericService/ApiService";

class UnitOfMeasureService extends ApiService<UnitOfMeasure> {
  constructor() {
    super();
  }

  public getAllUnits() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<UnitOfMeasure[]>("/UnitOfMeasure", {
      Authorization: `Bearer ${token}`,
    });
  }

  public createUnit(unit: UnitOfMeasure) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<UnitOfMeasure>("/UnitOfMeasure", unit, {
      Authorization: `Bearer ${token}`,
    });
  }

  public updateUnit(id: number, unit: UnitOfMeasure) {
    const token = Cookies.get("authAuthToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.updateWithHeaders(`/UnitOfMeasure/${id}`, unit, {
      Authorization: `Bearer ${token}`,
    });
  }

  public deleteUnit(id: number) {
    const token = Cookies.get("authAuthToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>("/UnitOfMeasure", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

export default new UnitOfMeasureService();
