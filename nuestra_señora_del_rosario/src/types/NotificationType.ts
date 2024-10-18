export interface Notification {
    id: number;
    title: string;
    message: string;
    createdAt: string;  // ISO date string
    isRead: boolean;
    appointmentId: number;
  }
  