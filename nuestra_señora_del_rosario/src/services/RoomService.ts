// src/services/RoomService.ts
import ApiService from './GenericService/ApiService';
import { RoomType } from '../types/RoomType';
import Cookies from 'js-cookie';

class RoomService extends ApiService<RoomType> {
  constructor() {
    super();
  }

  public getAllRooms() {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.getWithHeaders<RoomType[]>('/Room', {
      Authorization: `Bearer ${token}`,
    });
  }

  public getRoomById(id: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.getWithHeaders<RoomType>(`/Room/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  public createRoom(data: RoomType) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.postWithHeaders('/Room', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public updateRoom(id: number, data: Partial<RoomType>) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.patchWithHeaders(`/Room/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public deleteRoom(id: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.deleteWithHeaders('/Room', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const roomService = new RoomService();
export default roomService;
