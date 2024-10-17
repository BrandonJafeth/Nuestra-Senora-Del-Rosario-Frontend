// services/appointmentService.js
import axios from 'axios';

const API_URL = 'https://66424f4c3d66a67b3436f9fe.mockapi.io/Citas';

// Obtener todas las citas
export const getAppointments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

