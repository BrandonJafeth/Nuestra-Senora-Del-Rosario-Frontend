import ResetPasswordForm from '../components/specific/ResetPasswordForm';
import { useThemeDark } from '../hooks/useThemeDark';

function ResetPassword() {
  const { isDarkMode, toggleDarkMode } = useThemeDark();

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-[#f2f4f7]'}`}>
      
      {/* Botón para alternar entre modo oscuro y claro */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition"
      >
        {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
      </button>

      {/* Contenedor principal cubriendo todo el ancho y alto */}
      <div className={`relative w-full h-full min-h-screen flex rounded-none shadow-lg overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        
        {/* Columna izquierda - Validaciones de contraseña */}
        <div className={`flex-1 p-8 flex flex-col items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-gray-700' : 'bg-[#f2f4f7]'}`}>
          <img className="w-[150px] h-[150px] mb-8" src="https://i.ibb.co/D5xXgD5/Icon-whitout-fondo.png" alt="Logo" />
          <h2 className={`text-[25px] font-medium font-Poppins text-center mb-8 ${isDarkMode ? 'text-white' : 'text-[#0f1728]'}`}>
            Nuestra Señora del Rosario
          </h2>
          <div className={`text-xl leading-[28px] font-Gotham text-left ${isDarkMode ? 'text-gray-300' : 'text-[#717171]'}`}>
            <p className="font-bold mb-2">Información importante</p>
            <ul className="mt-4 list-disc pl-6">
              <li>Debe tener al menos 8 caracteres.</li>
              <li>Debe incluir una letra mayúscula y un número.</li>
              <li>No puede contener espacios en blanco.</li>
            </ul>
          </div>
        </div>

        {/* Columna derecha - Inputs */}
        <div className={`flex-1 flex flex-col justify-center items-center p-12 relative transition-colors duration-500 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-[#0f1728] text-white'}`}>
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold font-Poppins mb-4 text-center">Olvidó su contraseña</h2>
            <p className="text-xl font-light font-Poppins mb-8 text-center">No se preocupe. Nosotros le ayudamos.</p>

            {/* Formulario de restablecimiento */}
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;