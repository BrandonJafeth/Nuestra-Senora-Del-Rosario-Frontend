import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parseISO, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useAppointments } from '../../hooks/useAppointments';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import Modal from 'react-modal';
import AddAppointmentModal from './AddAppointmentModal'; // Importa el modal de agregar cita
import '../../styles/Calendar.css';

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse: (str: string) => parseISO(str),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

Modal.setAppElement('#root');

const AppointmentCalendar = () => {
  const { isDarkMode } = useThemeDark();
  const { data: appointments, isLoading, error, refetch } = useAppointments(); // `refetch` para actualizar datos
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dailyAppointments, setDailyAppointments] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false); // Estado para abrir/cerrar modal de agregar cita

  const dayPropGetter = (date: Date) => {
    if (new Date().toDateString() === date.toDateString()) {
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

  const groupAppointmentsByDate = () => {
    if (!appointments) return [];
    const grouped = appointments.data.reduce((acc: any, appointment: any) => {
      const date = format(parseISO(appointment.date), 'yyyy-MM-dd');
      if (!acc[date]) acc[date] = [];
      acc[date].push(appointment);
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, appts]) => ({
      title: 'Citas programadas',
      start: parseISO(date),
      end: parseISO(date),
      appointments: appts,
    }));
  };

  const events = groupAppointmentsByDate();

  const handleSelectEvent = (event: any) => {
    setDailyAppointments(event.appointments);
    setSelectedDate(event.start);
    setModalIsOpen(true);
  };

  const handleAddAppointment = () => {
    setShowAddModal(true); // Abrir el modal para agregar cita
  };

  const handleSaveAppointment = (newAppointment: any) => {
    console.log('Nueva cita:', newAppointment); // Puedes enviar los datos a tu API aquí
    refetch(); // Refrescar las citas después de agregar una nueva
    setShowAddModal(false); // Cerrar el modal
  };

  return (
    <div className={`h-[80vh] p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: '100%' }}
  dayPropGetter={dayPropGetter}
  onSelectEvent={handleSelectEvent}
  eventPropGetter={() => ({ className: 'custom-event-container' })}
  messages={{
    next: 'Siguiente',
    previous: 'Anterior',
    today: 'Hoy',
    month: 'Mes',
    noEventsInRange: 'No hay eventos en este rango.',
  }}
  className="rbc-calendar" /* Asegúrate de mantener esta clase */
  components={{
    toolbar: (props) => (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddAppointment}
          className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Agregar Cita
        </button>
        <div className="text-center flex-grow">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {format(props.date, 'MMMM yyyy', { locale: es })}
          </h2>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => props.onNavigate('TODAY')}
            className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Hoy
          </button>
          <button
            onClick={() => props.onNavigate('PREV')}
            className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Anterior
          </button>
          <button
            onClick={() => props.onNavigate('NEXT')}
            className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Siguiente
          </button>
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
        className={`p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 ${isDarkMode ? 'bg-[#1f2937] text-white' : 'bg-white text-gray-800'}`}
        overlayClassName={`fixed inset-0 ${isDarkMode ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'} z-50`}
        style={{ content: { zIndex: 1000 } }}
      >
        <h2 className="text-xl font-bold mb-4">
          Citas del {selectedDate ? format(selectedDate, 'PPP', { locale: es }) : ''}
        </h2>
        {dailyAppointments.length > 0 ? (
          <ul className="space-y-4">
            {dailyAppointments.map((appointment, index) => (
              <li key={index} className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-[#374151]' : 'bg-gray-100'}`}>
                <p className="font-semibold">Residente: {appointment.residentFullName}</p>
                <p>Fecha: {appointment.date}</p>
                <p>Hora: {appointment.time}</p>
                <p>Especialidad: {appointment.specialtyName}</p>
                <p>Centro: {appointment.healthcareCenterName}</p>
                <p>Estado: {appointment.statusName}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay citas programadas para este día.</p>
        )}

        <button onClick={() => setModalIsOpen(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Cerrar
        </button>
      </Modal>

      {/* Modal para agregar nueva cita */}
      <AddAppointmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        residents={[]} // Debes pasar los residentes aquí
        healthcareCenters={[]} // Y los centros de salud aquí
        specialties={[]} // Y especialidades aquí
        companions={[]} // Y los acompañantes aquí
        onSave={handleSaveAppointment}
      />
    </div>
  );
};

export default AppointmentCalendar;
