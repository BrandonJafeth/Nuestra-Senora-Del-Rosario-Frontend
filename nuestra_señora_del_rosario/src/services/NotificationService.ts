import ApiService from './GenericService/ApiService'; 
import { Notification } from '../types/NotificationType';

class NotificationService extends ApiService<Notification> {
  constructor() {
    super();
  }

  public getUnreadNotifications() {
    return this.getAll('/Notification');  // Endpoint para obtener notificaciones no leídas
  }

  public markAsRead(id: number) {
    return this.patch(`/Notification/${id}`, id, {});  // Marcar una notificación como leída
  }
}

const notificationService = new NotificationService();
export default notificationService;
