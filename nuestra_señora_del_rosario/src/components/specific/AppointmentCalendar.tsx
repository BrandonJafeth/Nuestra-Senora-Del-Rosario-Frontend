// FILE: AppointmentCalendar.tsx

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parseISO, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useAppointments } from '../../hooks/useAppointments';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import Modal from 'react-modal';
import AddAppointmentModal from './AddAppointmentModal';
import DailyAppointmentsModal from './DailyAppointmentsModal';
import NoteForm from './NoteForm'; // Importamos el formulario de notas
import { AnimatePresence, motion } from 'framer-motion'; // Animación para notificaciones
import { FiBell } from 'react-icons/fi'; // Icono de campana para notificaciones
import { useNavigate } from 'react-router-dom';
import '../../styles/Calendar.css';

// Localización del calendario
const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse: (str: string) => parseISO(str),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Establecemos el modal raíz para evitar problemas de accesibilidad
Modal.setAppElement('#root');

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();
  const { data: appointments, isLoading, error, refetch } = useAppointments();
  const { notifications } = useNotification();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dailyAppointments, setDailyAppointments] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNotification, setNewNotification] = useState<any | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState(0); // Contador de notificaciones no leídas
  const [notesModalIsOpen, setNotesModalIsOpen] = useState(false); // Estado del modal de notas

  // Manejo de notificaciones con framer-motion
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      setNewNotification(latestNotification);
      setShowPopup(true);

      // Ocultar popup después de 3 segundos
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer); // Limpiar temporizador al desmontar
    }
  }, [notifications]);

  // Agrupar citas por fecha
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

  // Funciones de manejo de eventos
  const handleSelectEvent = (event: any) => {
    setDailyAppointments(event.appointments);
    setSelectedDate(event.start);
    setModalIsOpen(true);
  };

  const handleAddAppointment = () => setShowAddModal(true);

  const handleSaveAppointment = (newAppointment: any) => {
    console.log('Nueva cita:', newAppointment);
    refetch(); // Refrescar las citas
    setShowAddModal(false);
  };

  const goToNotifications = () => navigate('/dashboard/notifications');

  const openNotesModal = () => setNotesModalIsOpen(true);
  const closeNotesModal = () => setNotesModalIsOpen(false);

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
        eventPropGetter={() => ({ className: 'custom-event-container' })}
        messages={{
          next: 'Siguiente',
          previous: 'Anterior',
          today: 'Hoy',
          month: 'Mes',
          noEventsInRange: 'No hay eventos en este rango.',
        }}
        className="rbc-calendar"
        components={{
          toolbar: (props) => (
            <div className="flex justify-between items-center mb-4">
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

              <div className="text-center flex-grow">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {format(props.date, 'MMMM yyyy', { locale: es })}
                </h2>
              </div>

              <button
                onClick={goToNotifications}
                className="relative px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          ),
        }}
      />

      <DailyAppointmentsModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        selectedDate={selectedDate}
        dailyAppointments={dailyAppointments}
        isDarkMode={isDarkMode}
        setDailyAppointments={setDailyAppointments}
        onSave={refetch}
      />

      <AddAppointmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        residents={[]} 
        healthcareCenters={[]} 
        specialties={[]} 
        companions={[]} 
        onSave={handleSaveAppointment}
      />

      <AnimatePresence>
        {showPopup && newNotification && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="fixed bg-blue-600 text-white p-6 rounded-lg shadow-lg"
            style={{ bottom: '20px', right: '20px', zIndex: 1050 }}
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
        className="p-6 rounded-lg shadow-lg max-w-md mx-auto bg-white dark:bg-gray-800"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <button onClick={closeNotesModal} className="absolute top-4 right-4">
          ✕
        </button>
        <NoteForm />
      </Modal>
    </div>
  );
};

export default AppointmentCalendar;
