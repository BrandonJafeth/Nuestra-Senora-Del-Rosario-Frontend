import { useState } from 'react';
import { useGuardianMutation } from '../../hooks/useGuardian'; // Hook para la mutación de guardián
import { useToast } from '../../hooks/useToast'; // Hook para mostrar notificaciones (Toast)
import { Guardian } from '../../types/GuardianType'; // Importamos el tipo Guardian

interface AddGuardianFormProps {
  setIsGuardianAdded: (added: boolean) => void;
  setGuardianId: (id: number | null) => void; // Cambiado para aceptar null
}

function AddGuardianForm({ setIsGuardianAdded, setGuardianId }: AddGuardianFormProps) {
  const { mutate: saveGuardian, isLoading } = useGuardianMutation();
  const { showToast } = useToast();

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
        console.log('Response from server:', response); // Log para ver la respuesta del servidor
        const id = response.data?.id_Guardian;
        
        if (id) {
          console.log('Guardian ID received:', id); // Verificar si recibimos el ID
          setGuardianId(id); // Log para ver si se llama a setGuardianId
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
    <div className="w-full max-w-[1169px] mx-auto p-6 bg-white rounded-[20px] shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8">Añadir Guardián</h2>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-6">
        {/* Nombre del guardián */}
        <div>
          <label className="block mb-2 text-lg">Nombre del Guardián</label>
          <input
            type="text"
            value={guardianData.name_GD}
            onChange={(e) => setGuardianData({ ...guardianData, name_GD: e.target.value })}
            className="w-full p-3 rounded-md bg-gray-200"
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
            className="w-full p-3 rounded-md bg-gray-200"
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
            className="w-full p-3 rounded-md bg-gray-200"
          />
        </div>

        {/* Cédula del guardián */}
        <div>
          <label className="block mb-2 text-lg">Cédula</label>
          <input
            type="text"
            value={guardianData.cedula_GD}
            onChange={(e) => setGuardianData({ ...guardianData, cedula_GD: e.target.value })}
            className="w-full p-3 rounded-md bg-gray-200"
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
            className="w-full p-3 rounded-md bg-gray-200"
          />
        </div>

        {/* Teléfono del guardián */}
        <div>
          <label className="block mb-2 text-lg">Teléfono</label>
          <input
            type="text"
            value={guardianData.phone_GD}
            onChange={(e) => setGuardianData({ ...guardianData, phone_GD: e.target.value })}
            className="w-full p-3 rounded-md bg-gray-200"
            required
          />
        </div>

        {/* Botones de guardar */}
        <div className="col-span-2 flex justify-center space-x-4 mt-8">
          {/* Botón de Guardar */}
          <button
            type="submit"
            disabled={isLoading}
            className="px-7 py-4 bg-blue-500 text-white text-lg rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
          >
            {isLoading ? 'Guardando...' : 'Guardar Guardián'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddGuardianForm;
