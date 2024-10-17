import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parseISO, startOfWeek, getDay, isToday} from 'date-fns';
import { es } from 'date-fns/locale';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useAppointments } from '../../hooks/useAppointments';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import Modal from 'react-modal';
import '../../styles/Calendar.css';

// Configuración del localizador de fechas
const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse: (str: string) => parseISO(str), // Asegura que parseamos correctamente la fecha
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

Modal.setAppElement('#root'); // Necesario para accesibilidad

const AppointmentCalendar = () => {
  const { isDarkMode } = useThemeDark();
  const { data: appointments, isLoading, error } = useAppointments();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dailyAppointments, setDailyAppointments] = useState<any[]>([]);

  // Estilo personalizado para el día actual
  const dayPropGetter = (date: Date) => {
    if (isToday(date)) {
      return {
        style: {
          backgroundColor: isDarkMode ? '#3b82f6' : '#ff5722',
          color: isDarkMode ? '#fff' : '#000',
        },
      };
    }
    return {};
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error al cargar las citas.</p>;

  // Agrupar citas por día asegurando que las fechas tengan el mismo formato
  const groupAppointmentsByDate = () => {
    const grouped = appointments.reduce((acc: any, appointment: any) => {
      const date = format(parseISO(appointment.Fecha), 'yyyy-MM-dd'); // Asegurar formato consistente
      if (!acc[date]) acc[date] = [];
      acc[date].push(appointment);
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, appts]) => ({
      title: 'Citas programadas', // Solo mostramos un evento por día
      start: parseISO(date), // Convertimos a objeto Date
      end: parseISO(date),
      appointments: appts,
    }));
  };

  const events = groupAppointmentsByDate();

  // Manejar apertura del modal con citas del día seleccionado
  const handleSelectEvent = (event: any) => {
    setDailyAppointments(event.appointments);
    setSelectedDate(event.start);
    setModalIsOpen(true);
  };

  return (
    <div
      className={`h-[80vh] p-4 rounded-lg shadow-lg ${
        isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'
      }`}
    >
      <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: '100%' }}
  dayPropGetter={dayPropGetter}
  onSelectEvent={handleSelectEvent}
  eventPropGetter={() => ({
    className: 'custom-event-container', 
  })}
  messages={{
    next: 'Siguiente',
    previous: 'Anterior',
    today: 'Hoy',
    month: 'Mes',
    noEventsInRange: 'No hay eventos en este rango.',
  }}
  components={{
    toolbar: (props) => (
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => props.onNavigate('TODAY')}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white text-gray-800 border hover:bg-gray-100'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => props.onNavigate('PREV')}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white text-gray-800 border hover:bg-gray-100'
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => props.onNavigate('NEXT')}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white text-gray-800 border hover:bg-gray-100'
            }`}
          >
            Siguiente
          </button>
        </div>
        <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {format(props.date, 'MMMM yyyy', { locale: es })}
        </div>
      </div>
    ),
  }}
/>
      {/* Modal para mostrar las citas del día */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Citas del día"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        style={{ content: { zIndex: 1000 } }}
      >
        <h2 className="text-xl font-bold mb-4">
          Citas del {selectedDate ? format(selectedDate, 'PPP', { locale: es }) : ''}
        </h2>

        {dailyAppointments.length > 0 ? (
          <ul className="space-y-4">
            {dailyAppointments.map((appointment, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                <p className="font-semibold">Residente: {appointment["Nombre"]}</p>
                <p>Especialidad: {appointment["Especialidad"]}</p>
                <p>Fecha: {appointment["Fecha"]}</p>
                <p>Hora: {appointment["Hora"]}</p>
                <p>Centro: {appointment["Centro"]}</p>
                <p>Encargado: {appointment["Encargado"]}</p>
                <p>Estado de la cita: {appointment["Estado"]}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay citas programadas para este día.</p>
        )}

        <button
          onClick={() => setModalIsOpen(false)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cerrar
        </button>
      </Modal>
    </div>
  );
};

export default AppointmentCalendar;
