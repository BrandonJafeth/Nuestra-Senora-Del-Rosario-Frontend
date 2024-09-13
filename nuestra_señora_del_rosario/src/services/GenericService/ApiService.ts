import axios, { AxiosInstance, AxiosResponse } from 'axios';


interface IReadService<T> {
    getAll(endpoint: string): Promise<AxiosResponse<T[]>>;
    getOne(endpoint: string, id: string | number): Promise<AxiosResponse<T>>;
  }
  
  interface IWriteService<T> {
    create(endpoint: string, data: T): Promise<AxiosResponse<T>>;
    update(endpoint: string, id: string | number, data: Partial<T>): Promise<AxiosResponse<T>>;
    delete(endpoint: string, id: string | number): Promise<AxiosResponse<void>>;
  }
  
  class ApiService<T> implements IReadService<T>, IWriteService<T> {
    private api: AxiosInstance;
  
    constructor() {
      this.api = axios.create({ baseURL: 'https://localhost:7066/api' });
    }
  
    // Methods from IReadService
    public async getAll(endpoint: string): Promise<AxiosResponse<T[]>> {
      return this.api.get<T[]>(endpoint);
    }
  
    public async getOne(endpoint: string, id: string | number): Promise<AxiosResponse<T>> {
      return this.api.get<T>(`${endpoint}/${id}`);
    }
  
    // Methods from IWriteService
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
  