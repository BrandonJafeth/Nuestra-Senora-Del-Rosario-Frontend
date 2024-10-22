// FILE: AppointmentCalendar.tsx

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parseISO, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useAppointments } from '../../hooks/useAppointments';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import Modal from 'react-modal';
import AddAppointmentModal from './AddAppointmentModal'; 
import DailyAppointmentsModal from './DailyAppointmentsModal'; 
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
  const { data: appointments, isLoading, error, refetch } = useAppointments(); 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dailyAppointments, setDailyAppointments] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false); 

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
    setShowAddModal(true);
  };

  const handleSaveAppointment = (newAppointment: any) => {
    console.log('Nueva cita:', newAppointment);
    refetch();
    setShowAddModal(false);
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
              <div className="text-center flex-grow">
                <h2
                  className={`text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {format(props.date, 'MMMM yyyy', { locale: es })}
                </h2>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => props.onNavigate('TODAY')}
                  className={`px-4 py-2 rounded ${
                    isDarkMode ? 'bg-blue-500' : 'bg-blue-500'
                  } text-white hover:bg-blue-600`}
                >
                  Hoy
                </button>
                <button
                  onClick={() => props.onNavigate('PREV')}
                  className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => props.onNavigate('NEXT')}
                  className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600`}
                >
                  Siguiente
                </button>
              </div>
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
    </div>
  );
};

export default AppointmentCalendar;
