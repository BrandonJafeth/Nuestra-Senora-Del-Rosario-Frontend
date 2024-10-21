// src/services/notificationService.ts
import axios from 'axios';
import { HubConnectionBuilder, HubConnection, HubConnectionState, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { NotificationGetDto } from '../types/NotificationType';

class NotificationService {
  private apiUrl = 'https://localhost:7066/api/Notification'; // URL del backend
  private hubUrl = 'https://localhost:7066/notificationHub'; // Hub de SignalR
  private connection: HubConnection | null = null; // Conexión de SignalR
  private reconnectAttempts: number = 0; // Contador de reintentos

  constructor() {
    this.initializeConnection();
  }

  // Inicializa la conexión con el Hub de SignalR
  private initializeConnection() {
    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
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

    this.connection.onreconnecting((error) => {
      console.warn(`🔄 Reconectando con SignalR... Intento #${this.reconnectAttempts}`, error);
    });

    this.connection.onreconnected(() => {
      console.log('✅ Reconexión exitosa con SignalR.');
      this.reconnectAttempts = 0; // Reiniciar contador de intentos
    });

    this.connection.onclose(async (error) => {
      console.error('❌ Conexión cerrada. Intentando reconectar...', error);
      await this.reconnectWithBackoff(); // Intentar reconexión controlada
    });
  }

  // Intentar iniciar la conexión
  private async startConnection() {
    try {
      if (this.connection?.state === HubConnectionState.Disconnected) {
        await this.connection.start();
        console.log('🔗 Conectado a SignalR');
      }
    } catch (err) {
      console.error('⚠️ Error al conectar con SignalR:', err);
      setTimeout(() => this.startConnection(), 5000); // Reintentar en 5 segundos
    }
  }

  // Maneja la reconexión controlada con un backoff limitado
  private async reconnectWithBackoff() {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectAttempts * 2000, 30000); // Máximo de 30 segundos

    console.warn(`🔄 Intentando reconectar en ${delay / 1000} segundos...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    this.startConnection();
  }

  // Escuchar notificaciones en tiempo real
  public onNotificationReceived(callback: (notification: NotificationGetDto) => void) {
    if (!this.connection) return;

    this.connection.on('ReceiveNotification', (notification: NotificationGetDto) => {
      console.log('📩 Notificación recibida:', notification);
      callback(notification);
    });
  }

  // Obtener notificaciones no leídas desde el backend
  public async getUnreadNotifications(): Promise<NotificationGetDto[]> {
    try {
      const response = await axios.get<NotificationGetDto[]>(this.apiUrl, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener notificaciones:', error);
      throw error;
    }
  }

  // Marcar una notificación como leída
  public async markAsRead(notificationId: number): Promise<void> {
    try {
      await axios.put(`${this.apiUrl}/${notificationId}`, null, this.getAuthHeaders());
      console.log(`✅ Notificación ${notificationId} marcada como leída.`);
    } catch (error) {
      console.error('❌ Error al marcar la notificación como leída:', error);
      throw error;
    }
  }

  // Generar headers de autenticación
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
  }

  // Desconectar la conexión de SignalR
  public disconnect() {
    if (this.connection) {
      this.connection.stop().then(() => console.log('🔌 Conexión de SignalR detenida.'));
    }
  }
}

export default new NotificationService();
