// notificationService.ts
import axios from 'axios';
import { HubConnectionBuilder, HubConnection, HubConnectionState } from '@microsoft/signalr';
import { NotificationGetDto } from '../types/NotificationType';

class NotificationService {
  private apiUrl = 'https://localhost:7066/api/notification'; // Ajusta según tu backend
  private hubUrl = 'https://localhost:7066/notificationHub';
  private connection: HubConnection;

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .configureLogging('information')
      .build();

    this.startConnection();
  }

  private startConnection() {
    if (this.connection.state === HubConnectionState.Disconnected) {
      this.connection.start()
        .then(() => console.log('Conectado a SignalR'))
        .catch(err => {
          console.error('Error al conectar con SignalR:', err);
          setTimeout(() => this.startConnection(), 5000); // Reintentar cada 5 segundos
        });
    }

    this.connection.onreconnecting(error => {
      console.warn('SignalR reconectando...', error);
    });

    this.connection.onreconnected(connectionId => {
      console.log('Reconectado. ID:', connectionId);
    });

    this.connection.onclose(error => {
      console.error('Desconectado. Intentando reconectar...', error);
      setTimeout(() => this.startConnection(), 5000);
    });
  }

  // Método para obtener notificaciones no leídas
  public async getUnreadNotifications(): Promise<NotificationGetDto[]> {
    try {
      const response = await axios.get<NotificationGetDto[]>(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  // Método para marcar una notificación como leída
  public async markAsRead(notificationId: number): Promise<void> {
    try {
      await axios.put(`${this.apiUrl}/${notificationId}`);
      console.log(`Notificación ${notificationId} marcada como leída.`);
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
      throw error;
    }
  }

  // Listener para recibir notificaciones en tiempo real
  public onNotificationReceived(callback: (notification: NotificationGetDto) => void) {
    this.connection.on('ReceiveNotification', (notification: NotificationGetDto) => {
      console.log('Notificación recibida:', notification);
      callback(notification);
    });
  }

  // Método para desconectar la conexión de SignalR
  public disconnect() {
    this.connection.stop().then(() => console.log('Conexión de SignalR detenida.'));
  }
}

export default new NotificationService();
