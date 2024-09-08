import IconContext from "./IconsContext";
import { FaUsers, FaClipboardList, FaCalendarAlt, FaDonate, FaHandsHelping, FaWarehouse } from 'react-icons/fa';


export const IconProvider = ({ children }: { children: React.ReactNode }) => {
    const iconMap: { [key: string]: JSX.Element } = {
      Residentes: <FaUsers />,
      Personal: <FaUsers />,
      Inventario: <FaWarehouse />,
      'Solicitudes de ingreso': <FaClipboardList />,
      Donaciones: <FaDonate />,
      Voluntariado: <FaHandsHelping />,
      'Cronograma de Citas': <FaCalendarAlt />,
    };
  
    const getIcon = (name: string) => iconMap[name] || null;
  
    return (
      <IconContext.Provider value={{ getIcon }}>
        {children}
      </IconContext.Provider>
    );
  };