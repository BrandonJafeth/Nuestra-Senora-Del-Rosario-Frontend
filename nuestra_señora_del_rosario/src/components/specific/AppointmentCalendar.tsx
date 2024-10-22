import { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; // Importamos framer-motion para animar el toast
import { FiBell, FiCheckCircle } from 'react-icons/fi'; // Icono para el toast
import { useNotification } from '../../hooks/useNotification';
import NoteForm from './NoteForm';

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
  const Navigate = useNavigate();
  const { isDarkMode } = useThemeDark();
  const { data: appointments, isLoading, error, refetch } = useAppointments(); // `refetch` para actualizar datos
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dailyAppointments, setDailyAppointments] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false); // Estado para abrir/cerrar modal de agregar cita
  const { notifications } = useNotification();
  const [newNotification, setNewNotification] = useState<any | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState(0); // Estado para almacenar el número de notificaciones no leídas
  const [notesModalIsOpen, setNotesModalIsOpen] = useState(false); // Estado para el modal de notas
 


  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      setNewNotification(latestNotification);
      setShowPopup(true);

      // Ocultar el popup después de 3 segundos
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
    }
  }, [notifications]);

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

const goToNotifications = () => {
Navigate('/dashboard/notifications');
}

const openNotesModal = () => setNotesModalIsOpen(true);
  const closeNotesModal = () => setNotesModalIsOpen(false);

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
       <div className="flex justify-start items-center space-x-4 mb-4">
  <button
    onClick={handleAddAppointment}
    className={`px-4 py-2 rounded ${
      isDarkMode
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
  >
    Agregar Cita
  </button>

  <button
    onClick={openNotesModal}
    className={`px-4 py-2 rounded ${
      isDarkMode
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
  >
    Notas
  </button>
</div>
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
          <button
        onClick={goToNotifications}
        className={`relative px-4 py-2 rounded ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        <FiBell />

        {/* Badge de notificaciones no leídas */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
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
          Citas del {selectedDate ? formatLongDate(selectedDate.toISOString()) : ''}
        </h2>
        {dailyAppointments.length > 0 ? (
          <ul className="space-y-4">
            {dailyAppointments.map((appointment, index) => (
              <li key={index} className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-[#374151]' : 'bg-gray-100'}`}>
                <p className="font-semibold">Residente: {appointment.residentFullName}</p>
                <p>Fecha: {formatDate(appointment.date)}</p>
                <p>Hora: {formatTime(appointment.time)}</p>
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
     <AnimatePresence>
  {showPopup && newNotification && (
    <motion.div
      initial={{ opacity: 0, y: 30 }} // Aparece desde abajo
      animate={{ opacity: 1, y: 0 }} // Subida suave al mostrarse
      exit={{ opacity: 0, y: 30 }} // Desaparece bajando
      transition={{ duration: 0.5 }}
      className="fixed bg-blue-600 text-white p-6 rounded-lg shadow-lg flex items-center space-x-4"
      style={{
        bottom: '20px', // Posición desde el borde inferior
        right: '20px',  // Posición desde el borde derecho
        zIndex: 1050,   // Asegura que esté delante de otros elementos
        pointerEvents: 'auto', // Permite interacción
      }}
    >
      <h3 className="text-lg font-bold">{newNotification.title}</h3>
      <p className="ml-4">{newNotification.message}</p>
    </motion.div>
  )}
</AnimatePresence>

<Modal
  isOpen={notesModalIsOpen}
  onRequestClose={closeNotesModal}
  contentLabel="Agregar Nota"
  className={`relative p-6 rounded-lg shadow-lg max-w-md mx-auto bg-white dark:bg-gray-800`}
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
  style={{
    content: {
      zIndex: 1050, // Asegura que tenga prioridad
      position: 'relative',
    },
  }}
>
  {/* Botón de cerrar en la esquina superior derecha */}
  <button
    onClick={closeNotesModal}
    className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition"
  >
    ✕
  </button>

  {/* Formulario de Nota */}
  <NoteForm />
</Modal>
    </div>
  );
};

export default AppointmentCalendar;
