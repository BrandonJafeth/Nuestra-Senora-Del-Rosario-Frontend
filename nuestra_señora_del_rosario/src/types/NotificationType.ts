// types.ts
export interface NotificationGetDto {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // Usamos string para fechas (ISO 8601)
  appointmentId: number;
}
