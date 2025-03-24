// src/services/LawService.ts
import { ApiResponse } from "../types/AssetsCategoryType";
import { LawType } from "../types/LawType";
import ApiService from "./GenericService/ApiService";
import Cookies from "js-cookie";

class LawService extends ApiService<LawType> {
  constructor() {
    super();
  }

  public getAllLaws() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Se usa getWithHeaders para incluir el token
    return this.getWithHeaders<LawType[]>("/Law", {
      Authorization: `Bearer ${token}`,
    }) as unknown as Promise<{ data: ApiResponse<LawType[]> }>;
  }

  public getLawById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<LawType>(`/Law/${id}`, {
      Authorization: `Bearer ${token}`,
    }) as Promise<{ data: LawType }>;
  }
}

export default new LawService();
