// components/ProductConsumptionCalendar.tsx
import React, { useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useThemeDark } from '../../hooks/useThemeDark';
import '../../styles/CustomCalendar.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { InventoryMovement } from '../../types/InventoryMovement';
import ProductRequestModal from './ProductRequestModal';
import { useDailyMovements } from '../../hooks/useDailyMovement';
import DailyMovementsModal from './DailyMovementModal';
import { useCreateInventoryMovement } from '../../hooks/useInventoryMovement';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
moment.locale('es');
const localizer = momentLocalizer(moment);

interface ProductConsumptionEvent extends Event {
  title: string;
  start: Date;
  end: Date;
  product: string;
  quantity: number;
}

const ProductCalendar: React.FC = () => {
  const [events, setEvents] = useState<ProductConsumptionEvent[]>([]);

  const [isProductRequestModalOpen, setIsProductRequestModalOpen] = useState(false); // Estado para el modal de consumo de productos
  const [isDailyMovementsModalOpen, setIsDailyMovementsModalOpen] = useState(false); // Estado para el modal de movimientos diarios
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { isDarkMode } = useThemeDark();
  const formattedDate = selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : '';
  const { data: dailyMovements, isLoading } = useDailyMovements(formattedDate);
  const {showToast, message, type} = useToast(); 

  // Hook para crear un movimiento de inventario
  const createInventoryMovement = useCreateInventoryMovement();

  const handleOpenProductRequestModal = () => {
    setIsProductRequestModalOpen(true);
  };

  const handleCloseProductRequestModal = () => {
    setIsProductRequestModalOpen(false);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsDailyMovementsModalOpen(true);
  };

  const handleSaveMovement = async (movement: InventoryMovement) => {
    createInventoryMovement.mutate([movement], {
      onSuccess: () => {
      showToast('Egreso registrado correctamente', 'success');
        setEvents([
          ...events,
          {
            title: `Consumo de ${movement.productID}`,
            start: new Date(),
            end: new Date(),
            product: 'Producto',
            quantity: movement.quantity,
          },
        ]);
      },
      onError: (error : any) => {
        showToast(error, 'error');
      },
    });
  };

  return (
    <div className={`h-[80vh] p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={() => ({ className: 'custom-event-container' })}
        onSelectSlot={(slotInfo) => handleSelectDate(slotInfo.start)}
        selectable
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
              <div className="text-center flex-grow">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {format(props.date, 'MMMM yyyy', { locale: es })}
                </h2>
              </div>
              <div className="space-x-4">
                <button
                  onClick={handleOpenProductRequestModal}
                  className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Pedir producto
                </button>
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
        <Toast message={message} type={type} />

      <ProductRequestModal
        isOpen={isProductRequestModalOpen}
        onRequestClose={handleCloseProductRequestModal}
        onSave={handleSaveMovement}
      />

      <DailyMovementsModal
        isOpen={isDailyMovementsModalOpen}
        onRequestClose={() => setIsDailyMovementsModalOpen(false)}
        movements={dailyMovements || null}
        formattedDate={formattedDate}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductCalendar;
