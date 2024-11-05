// components/ProductConsumptionCalendar.tsx
import React, { useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useThemeDark } from '../../hooks/useThemeDark';
import '../../styles/CustomCalendar.css'; // Importa el archivo CSS personalizado
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { InventoryMovement } from '../../types/InventoryMovement';
import ProductRequestModal from './ProductRequestModal';

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
  const [events, setEvents] = useState<ProductConsumptionEvent[]>([
    {
      title: 'Consumo de Arroz',
      start: new Date(),
      end: new Date(),
      product: 'Arroz',
      quantity: 20,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode } = useThemeDark();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveMovement = async (movement: InventoryMovement) => {
    // Aquí harías el POST a la API
    try {
      const response = await fetch('/api/inventory/movement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movement),
      });

      if (response.ok) {
        alert('Producto egresado correctamente');
        setEvents([
          ...events,
          {
            title: `Consumo de ${movement.productID}`, // Cambia según el nombre real del producto
            start: new Date(),
            end: new Date(),
            product: 'Producto', // Cambia por el nombre real si está disponible
            quantity: movement.quantity,
          },
        ]);
      } else {
        alert('Error al registrar el egreso');
      }
    } catch (error) {
      console.error('Error al realizar la petición:', error);
      alert('Error al realizar la petición');
    }
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
          onClick={handleOpenModal}
          className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Pedir Producto
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
     <ProductRequestModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onSave={handleSaveMovement}
      />
  </div>
  );
};

export default ProductCalendar;
