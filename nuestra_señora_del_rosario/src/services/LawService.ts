import { ApiResponse } from "../types/AssetsCategoryType";
import { LawType } from "../types/LawType";
import ApiService from "./GenericService/ApiService";

class LawService extends ApiService<LawType> {
  constructor() {
    super();
  }

  public getAllLaws() {
    return this.getAll("Law") as unknown as Promise<{ data: ApiResponse<LawType[]> }>;
  }

  public getLawById(id: number) {
    return this.getOne("Law", id) as Promise<{ data: LawType }>;
  }
}

export default new LawService();
