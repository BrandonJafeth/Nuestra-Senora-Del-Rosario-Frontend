import { useThemeDark } from '../../hooks/useThemeDark';

const HomeDashboard = () => {
  const { isDarkMode } = useThemeDark();

  return (
    <div
      className={`flex flex-col justify-center items-center h-full p-6 transition ${isDarkMode ? 'bg-transparent text-[#0D313F]' : 'bg-transparent text-gray-800'}`}
    >
      <h1 className="text-4xl font-bold mb-6">¡Bienvenido al sistema!</h1>
      <p className="text-lg mb-6 max-w-2xl text-center">
        Gracias por unirte a <span className="font-semibold">Nuestra Señora del Rosario</span>. 
        Explora las diferentes secciones desde el menú lateral para gestionar el sistema de forma eficiente y sencilla.
      </p>
      <img
        src="https://i.ibb.co/D5xXgD5/Icon-whitout-fondo.png"
        alt="Ilustración de bienvenida"
        className="w-1/3 max-w-xs mb-6"
      />
    </div>
  );
};

export default HomeDashboard;
