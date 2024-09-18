// FILE: services/StatusService.ts
import { StatusData } from "../types/StatusType";
import ApiService from "./GenericService/ApiService";

class StatusService extends ApiService<StatusData> {
  public async getAllStatus(): Promise<StatusData[]> {
    const response = await this.getAll('/Status');
    return response.data;
  }

  public async getStatusById(id: number): Promise<StatusData> {
    const response = await this.getOne('/Status', id);
    return response.data;
  }
}

const statusService = new StatusService();
export default statusService;