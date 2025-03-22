// FILE: ApiService.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface IReadService<T> {
    getAll(endpoint: string): Promise<AxiosResponse<T[]>>;
    getOne(endpoint: string, id: string | number): Promise<AxiosResponse<T>>;
}

interface IWriteService<T> {
    create(endpoint: string, data: T): Promise<AxiosResponse<T>>;
    update(endpoint: string, id: string | number, data: Partial<T>): Promise<AxiosResponse<T>>;
    patch(endpoint: string, id: string | number, data: Partial<T>): Promise<AxiosResponse<T>>;
    delete(endpoint: string, id: string | number): Promise<AxiosResponse<void>>;
}

class ApiService<T> implements IReadService<T>, IWriteService<T> {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({ baseURL: 'https://localhost:7066/api' });
    }
    //https://localhost:7066/api
    //https://nuestra-senora-del-rosario-backend.onrender.com/api
    //https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api

    // Methods from IReadService
    public async getAll(endpoint: string): Promise<AxiosResponse<T[]>> {
        return this.api.get<T[]>(endpoint);
    }
    
   // En ApiService.ts
public async getAllPages(endpoint: string, pageNumber: number, pageSize: number): Promise<AxiosResponse<any>> {
    return this.api.get(endpoint, { params: { pageNumber, pageSize } });
}


    public async getOne(endpoint: string, id: string | number): Promise<AxiosResponse<T>> {
        return this.api.get<T>(`${endpoint}/${id}`);
    }

    // Methods from IWriteService
    public async create(endpoint: string, data: T): Promise<AxiosResponse<T>> {
        return this.api.post<T>(endpoint, data);
    }

    public async update(endpoint: string, id?: string | number, data?: Partial<T>): Promise<AxiosResponse<T>> {
        return this.api.put<T>(`${endpoint}/${id}`, data);
    }

    public async putWithoutId(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> {
        return this.api.put<T>(endpoint, data);
    }
    

    
public async createWithParams<R>(endpoint: string, params: Record<string, any>): Promise<AxiosResponse<R>> {
    return this.api.post<R>(endpoint, null, { params }); // Enviamos null en el body y pasamos los parámetros
}


    public async patch(endpoint: string, id: string | number, data: Partial<T>): Promise<AxiosResponse<T>> {
        return this.api.patch<T>(`${endpoint}/${id}`, data);
    }

    public async patchWithoutId(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> {
        return this.api.patch<T>(endpoint, data);
    }

    public async delete(endpoint: string, id: string | number): Promise<AxiosResponse<void>> {
        return this.api.delete<void>(`${endpoint}/${id}`);
    }

    public async getWithHeaders<R>(endpoint: string, headers: Record<string, string>): Promise<AxiosResponse<R>> {
        return axios.get<R>(`${this.api.defaults.baseURL}${endpoint}`, { headers });
      }
      
      public  async updateWithHeaders(url: string, data: Partial<T>, headers: Record<string, string>) {
        return this.api.put(url, data, { headers });
      }

      public async patchWithHeaders(url: string, data: Partial<T>, headers: Record<string, string>) {
        return this.api.patch(url, data, { headers });
        }

      public async postWithHeaders<R>(endpoint: string, data: any, headers: Record<string, string>): Promise<AxiosResponse<R>> {
        return axios.post<R>(`${this.api.defaults.baseURL}${endpoint}`, data, { headers });
      }

      public deleteWithHeaders<T>(url: string, id: string, headers?: any): Promise<AxiosResponse<T>> {
        return this.api.delete<T>(`${url}/${id}`, { headers });
      }

}

export default ApiService;
