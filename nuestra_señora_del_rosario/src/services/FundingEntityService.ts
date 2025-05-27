// src/services/FundingEntityService.ts
import { FundingEntityType } from "../types/FundingEntityType";
import ApiService from "./GenericService/ApiService";
import Cookies from "js-cookie";

class FundingEntityService extends ApiService<FundingEntityType> {
  constructor() {
    super();
  }
  public getAllFundingEntities() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Se usa getWithHeaders para incluir el token
    return this.getWithHeaders<FundingEntityType[]>("/FundingEntity", {
      Authorization: `Bearer ${token}`,
    });
  }

  public getFundingEntityById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<FundingEntityType>(`/FundingEntity/${id}`, {
      Authorization: `Bearer ${token}`,
    }) as Promise<{ data: FundingEntityType }>;
  }
}

export default new FundingEntityService();
