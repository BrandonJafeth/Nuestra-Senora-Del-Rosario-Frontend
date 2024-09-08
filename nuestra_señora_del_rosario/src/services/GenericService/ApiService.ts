import axios, { AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL = 'http://localhost:5074/api'; // URL base común

class ApiService<T> {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
    });
  }

  public async getAll(endpoint: string): Promise<AxiosResponse<T[]>> {
    return this.api.get<T[]>(endpoint); // Concatenación automática por Axios
  }

  public async getOne(endpoint: string, id: string | number): Promise<AxiosResponse<T>> {
    return this.api.get<T>(`${endpoint}/${id}`);
  }

  public async create(endpoint: string, data: T): Promise<AxiosResponse<T>> {
    return this.api.post<T>(endpoint, data);
  }

  public async update(endpoint: string, id: string | number, data: Partial<T>): Promise<AxiosResponse<T>> {
    return this.api.put<T>(`${endpoint}/${id}`, data);
  }

  public async delete(endpoint: string, id: string | number): Promise<AxiosResponse<void>> {
    return this.api.delete<void>(`${endpoint}/${id}`);
  }
}

export default ApiService;
