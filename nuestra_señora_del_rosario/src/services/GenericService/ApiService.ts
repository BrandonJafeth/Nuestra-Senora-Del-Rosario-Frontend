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
    //https://nuestra-senora-del-rosario-backend-2.onrender.com/api

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

    public async delete(endpoint: string, id: string | number): Promise<AxiosResponse<void>> {
        return this.api.delete<void>(`${endpoint}/${id}`);
    }

}

export default ApiService;
