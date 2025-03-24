import axios, { } from 'axios';
import Cookies from 'js-cookie';
import { HubConnectionBuilder, HubConnection, HubConnectionState, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { NotificationGetDto } from '../types/NotificationType';

class NotificationService {
  private apiUrl = 'https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api/Notification'; // URL del backend
  private hubUrl = 'https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/notificationHub'; // Hub de SignalR
  private connection: HubConnection | null = null; // Conexión de SignalR
  private reconnectAttempts: number = 0; // Contador de reintentos

  constructor() {
    this.initializeConnection();
  }

  // Inicializa la conexión con el Hub de SignalR
  private initializeConnection() {
    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => Cookies.get('authToken') || '', // Obtener el token de acceso
        skipNegotiation: true, // Omitir la negociación
        transport: HttpTransportType.WebSockets, // Forzar uso de WebSocket
        withCredentials: true, // Enviar credenciales si es necesario
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // Retrasos progresivos
      .configureLogging(LogLevel.Information)
      .build();

    this.registerConnectionEvents();
    this.startConnection();
  }

  // Registra los eventos relevantes de la conexión
  private registerConnectionEvents() {
    if (!this.connection) return;

    this.connection.onreconnecting(() => {
      // Aquí podrías notificar que se está reconectando, si lo deseas.
    });

    this.connection.onreconnected(() => {
      this.reconnectAttempts = 0; // Reiniciar contador de intentos
    });

    this.connection.onclose(async () => {
      await this.reconnectWithBackoff(); // Intentar reconexión controlada
    });
  }

  // Inicia la conexión con el Hub
  private async startConnection() {
    try {
      if (this.connection?.state === HubConnectionState.Disconnected) {
        await this.connection.start();
        // Conexión iniciada correctamente.
      }
    } catch (err) {
      console.error('Error al conectar con SignalR:', err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  // Mecanismo de reconexión con backoff
  private async reconnectWithBackoff() {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectAttempts * 2000, 30000); // Máximo de 30 segundos
    console.warn(`Intentando reconectar en ${delay / 1000} segundos...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    this.startConnection();
  }

  // Método para obtener el token y generar los headers
  private getAuthHeaders() {
    const token = Cookies.get('authToken'); // O, si lo prefieres, localStorage.getItem('token')
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  // Escuchar notificaciones en tiempo real
  public onNotificationReceived(callback: (notification: NotificationGetDto) => void) {
    if (!this.connection) return;

    this.connection.on('ReceiveNotification', (notification: NotificationGetDto) => {
      callback(notification);
    });
  }

  // Obtener notificaciones no leídas desde el backend
  public async getUnreadNotifications(): Promise<NotificationGetDto[]> {
    try {
      const response = await axios.get<NotificationGetDto[]>(this.apiUrl, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  // Marcar una notificación como leída
  public async markAsRead(notificationId: number): Promise<void> {
    try {
      await axios.put(`${this.apiUrl}/${notificationId}`, null, this.getAuthHeaders());
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
      throw error;
    }
  }

  // Desconectar la conexión de SignalR
  public disconnect() {
    if (this.connection) {
      this.connection.stop().then(() => console.log('Conexión de SignalR detenida.'));
    }
  }
}

export default new NotificationService();
