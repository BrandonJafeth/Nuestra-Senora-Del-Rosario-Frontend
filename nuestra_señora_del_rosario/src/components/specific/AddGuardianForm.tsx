import { useState } from 'react';
import { useGuardianMutation } from '../../hooks/useGuardian'; // Hook para la mutación de guardián
import { useToast } from '../../hooks/useToast'; // Hook para mostrar notificaciones (Toast)
import { Guardian } from '../../types/GuardianType'; // Importamos el tipo Guardian
import { useThemeDark } from '../../hooks/useThemeDark'; // Hook para detectar modo oscuro
import Toast from '../common/Toast';

interface AddGuardianFormProps {
  setIsGuardianAdded: (added: boolean) => void;
  setGuardianId: (id: number | null) => void; // Cambiado para aceptar null
}

function AddGuardianForm({ setIsGuardianAdded, setGuardianId }: AddGuardianFormProps) {
  const { mutate: saveGuardian, isLoading } = useGuardianMutation();
  const { showToast, message, type } = useToast();
  const { isDarkMode } = useThemeDark(); // Usar hook para detectar modo oscuro

  const [guardianData, setGuardianData] = useState<Partial<Guardian>>({
    name_GD: '',
    lastname1_GD: '',
    lastname2_GD: '',
    cedula_GD: '',
    email_GD: '',
    phone_GD: '',
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    saveGuardian(guardianData as Guardian, {
      onSuccess: (response) => {
        const id = response.data?.id_Guardian;
        if (id) {
          setGuardianId(id);
          setIsGuardianAdded(true);
          showToast('Guardián añadido exitosamente', 'success');
        } else {
          console.error('No se pudo obtener el ID del guardián.');
        }
      },
      onError: (error) => {
        console.error('Error al añadir el guardián:', error);
        showToast('Error al añadir el guardián. Revisa los datos ingresados', 'error');
      },
    });
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <h2 className={`text-3xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Añadir Encargado</h2>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-6">
        {/* Nombre del guardián */}
        <div>
          <label className="block mb-2 text-lg">Nombre del Encargado</label>
          <input
            type="text"
            value={guardianData.name_GD}
            onChange={(e) => setGuardianData({ ...guardianData, name_GD: e.target.value })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            required
          />
        </div>

        {/* Primer apellido del guardián */}
        <div>
          <label className="block mb-2 text-lg">Primer Apellido</label>
          <input
            type="text"
            value={guardianData.lastname1_GD}
            onChange={(e) => setGuardianData({ ...guardianData, lastname1_GD: e.target.value })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            required
          />
        </div>

        {/* Segundo apellido del guardián */}
        <div>
          <label className="block mb-2 text-lg">Segundo Apellido</label>
          <input
            type="text"
            value={guardianData.lastname2_GD}
            onChange={(e) => setGuardianData({ ...guardianData, lastname2_GD: e.target.value })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          />
        </div>

        {/* Cédula del guardián */}
        <div>
          <label className="block mb-2 text-lg">Cédula</label>
          <input
            type="text"
            value={guardianData.cedula_GD}
            onChange={(e) => setGuardianData({ ...guardianData, cedula_GD: e.target.value })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            required
          />
        </div>

        {/* Correo electrónico del guardián */}
        <div>
          <label className="block mb-2 text-lg">Correo Electrónico</label>
          <input
            type="email"
            value={guardianData.email_GD}
            onChange={(e) => setGuardianData({ ...guardianData, email_GD: e.target.value })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          />
        </div>

        {/* Teléfono del guardián */}
        <div>
          <label className="block mb-2 text-lg">Teléfono</label>
          <input
            type="text"
            value={guardianData.phone_GD}
            onChange={(e) => setGuardianData({ ...guardianData, phone_GD: e.target.value })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            required
          />
        </div>

        {/* Botones de guardar */}
        <div className="col-span-2 flex justify-center space-x-4 mt-8">
          {/* Botón de Guardar */}
          <button
            type="submit"
            disabled={isLoading}
            className={`px-7 py-4 rounded-lg shadow-lg transition duration-200 ${isLoading ? 'bg-gray-400' : isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isLoading ? 'Guardando...' : 'Guardar Encargado'}
          </button>
        </div>
      </form>
    <Toast message={message} type={type} />
    </div>
  );
}

export default AddGuardianForm;
