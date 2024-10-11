


// services/RoomService.ts

import ApiService from './GenericService/ApiService'; // Asegúrate de que la ruta sea correcta
import { RoomType } from '../types/RoomType'; // Asegúrate de que la ruta sea correcta

class RoomService extends ApiService<RoomType> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // Obtener todas las habitaciones
  public getAllRooms() {
    return this.getAll('/Room'); // Cambia la ruta según tu API
  }

  // Obtener una habitación por ID
  public getRoomById(id: number) {
    return this.getOne('/Room', id); // Cambia la ruta según tu API
  }

  // Crear una nueva habitación
  public createRoom(data: RoomType) {
    return this.create('/Room', data); // Cambia la ruta según tu API
  }

  // Actualizar una habitación existente
  public updateRoom(id: number, data: Partial<RoomType>) {
    return this.patch(`/Room/${id}`, id, data); // Cambia la ruta según tu API
  }

  // Eliminar una habitación
  public deleteRoom(id: number) {
    return this.delete('/Room', id); // Cambia la ruta según tu API
  }
}

const roomService = new RoomService();
export default roomService;
