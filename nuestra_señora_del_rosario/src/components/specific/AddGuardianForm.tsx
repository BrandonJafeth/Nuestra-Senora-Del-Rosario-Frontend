import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { useGuardianMutation } from '../../hooks/useGuardian';

function AddGuardianForm() {
  const navigate = useNavigate(); // Hook para navegar entre rutas
  const { mutate: saveGuardian, isLoading } = useGuardianMutation(); // Hook para guardar el guardián
  const [guardianData, setGuardianData] = useState({
    id_Guardian: 0,
    name_GD: '',
    lastname1_GD: '',
    lastname2_GD: '',
    cedula_GD: '',
    email_GD: '',
    phone_GD: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveGuardian(guardianData, {
      onSuccess: () => {
        // Redirigir a la página para añadir la información del residente después de guardar el guardián
        navigate('/informacionResidente');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del guardián */}
      <div>
        <label>Nombre del Guardián</label>
        <input
          type="text"
          value={guardianData.name_GD}
          onChange={(e) => setGuardianData({ ...guardianData, name_GD: e.target.value })}
          placeholder="Nombre del encargado"
          required
        />
      </div>

      <div>
        <label>Teléfono del encargado</label>
        <input
          type="text"
          value={guardianData.phone_GD}
          onChange={(e) => setGuardianData({ ...guardianData, phone_GD: e.target.value })}
          placeholder="Teléfono del encargado"
          required
        />
      </div>

      <div className="mt-4">
        {/* Botón de Guardar y Navegar */}
        <button type="submit" disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          {isLoading ? 'Guardando...' : 'Guardar y Siguiente'}
        </button>
      </div>
    </form>
  );
}

export default AddGuardianForm;
