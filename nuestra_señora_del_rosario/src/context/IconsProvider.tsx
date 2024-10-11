import { FaUsers, FaClipboardList, FaCalendarAlt, FaDonate, FaHandsHelping, FaWarehouse, FaSignInAlt, FaIdCard, FaLock  } from 'react-icons/fa'; // Agrega FaSearch
import IconContext from './IconsContext';

export const IconProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    Residentes: <FaUsers />,
    Personal: <FaUsers />,
    Inventario: <FaWarehouse />,
    'Solicitudes de ingreso': <FaClipboardList />,
    Ingreso: <FaSignInAlt />, 
    Donaciones: <FaDonate />,
    Voluntariado: <FaHandsHelping />,
    'Cronograma de Citas': <FaCalendarAlt />,
    Cedula: <FaIdCard />, 
    Contraseña: <FaLock />,
   
  };

  const getIcon = (name: string) => iconMap[name] || null;

  return (
    <IconContext.Provider value={{ getIcon }}>
      {children}
    </IconContext.Provider>
  );
};
