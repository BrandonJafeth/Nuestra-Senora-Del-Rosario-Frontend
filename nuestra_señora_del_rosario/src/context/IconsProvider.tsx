import { 
  FaUsers, 
  FaClipboardList, 
  FaCalendarAlt, 
  FaDonate, 
  FaHandsHelping, 
  FaWarehouse, 
  FaSignInAlt, 
  FaIdCard, 
  FaLock,
  FaListUl,       // Icono para "Lista de productos"
  FaBoxOpen,       // Icono para "Consumo de Productos"
  FaLaptop,
  FaArrowAltCircleLeft
} from 'react-icons/fa'; 
import IconContext from './IconsContext';

export const IconProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    Residentes: <FaUsers />,
    Usuarios: <FaUsers />,
    Cardex: <FaClipboardList />,
    Personal: <FaUsers />,
    Inventario: <FaWarehouse />,
    Solicitudes: <FaClipboardList />,
    'Solicitudes de ingreso': <FaClipboardList />,
    Ingreso: <FaSignInAlt />, 
    Donaciones: <FaDonate />,
    Voluntariado: <FaHandsHelping />,
    'Cronograma de Citas': <FaCalendarAlt />,
    'Ajustes del Usuario': <FaUsers />,
    'Ajustes del Sistema': <FaLaptop />,
    'Página Informativa': <FaUsers />,
    'Página Central': <FaArrowAltCircleLeft />,
    Cedula: <FaIdCard />, 
    Contraseña: <FaLock />,
    'Lista de productos': <FaListUl />,     // Icono para "Lista de productos"
    'Consumo de Productos': <FaBoxOpen />   // Icono para "Consumo de Productos"
  };

  const getIcon = (name: string) => iconMap[name] || null;

  return (
    <IconContext.Provider value={{ getIcon }}>
      {children}
    </IconContext.Provider>
  );
};
