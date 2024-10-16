
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { useThemeDark } from '../../hooks/useThemeDark'; // Hook para manejar el modo oscuro

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const AppointmentCalendar = () => {
  const { isDarkMode } = useThemeDark(); // Usar el hook para detectar el modo

  // Función para aplicar estilo personalizado al día actual
  const dayPropGetter = (date: string | number | Date) => {
    if (isToday(date)) {
      return {
        className: 'bg-blue', // Fondo transparente
        style: {
          color: isDarkMode ? '#000000' : '#ff0000', // Rojo oscuro en modo oscuro, rojo brillante en modo claro
          fontWeight: 'bold', // Opción: resaltar el día
        },
      };
    }
    return {};
  };
  

  return (
    <div className={`h-[80vh] ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'} p-4 rounded-lg shadow-lg`}>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        className={`${
          isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'
        }`} // Fondo y texto para modo claro y oscuro
        views={['month']} // Limitar la vista únicamente a mensual
        defaultView="month" // Vista por defecto
        dayPropGetter={dayPropGetter} // Estilo personalizado para el día actual
        messages={{
          next: 'Siguiente',
          previous: 'Anterior',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este rango.',
        }}
        components={{
          toolbar: (props) => {
            const currentMonth = format(props.date, 'MMMM yyyy', { locale: es }); // Formatear el mes actual en español
            return (
              <div className="flex justify-between items-center mb-4">
                {/* Botones de navegación (Hoy, Anterior, Siguiente) */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => props.onNavigate('TODAY')}
                    className={`px-4 py-2 rounded ${
                      isDarkMode
                        ? 'text-white bg-blue-500 hover:bg-blue-600'
                        : 'text-gray-800 bg-white border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Hoy
                  </button>
                  <button
                    onClick={() => props.onNavigate('PREV')}
                    className={`px-4 py-2 rounded ${
                      isDarkMode
                        ? 'text-white bg-blue-500 hover:bg-blue-600'
                        : 'text-gray-800 bg-white border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => props.onNavigate('NEXT')}
                    className={`px-4 py-2 rounded ${
                      isDarkMode
                        ? 'text-white bg-blue-500 hover:bg-blue-600'
                        : 'text-gray-800 bg-white border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Siguiente
                  </button>
                </div>

                {/* Mostrar mes y año actual */}
                <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {currentMonth}
                </div>

                {/* Solo la pestaña "Mes" ya que eliminamos las otras vistas */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => props.onView('month')}
                    className={`px-4 py-2 rounded ${
                      isDarkMode
                        ? 'text-white bg-blue-500 hover:bg-blue-600'
                        : 'text-gray-800 bg-white border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Mes
                  </button>
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default AppointmentCalendar;
