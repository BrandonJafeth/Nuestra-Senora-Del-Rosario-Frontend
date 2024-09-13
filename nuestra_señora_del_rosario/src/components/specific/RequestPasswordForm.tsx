import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RequestPasswordForm() {
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí harías la llamada a la API para enviar el correo de restablecimiento
    console.log('Enviar datos:', { email, cedula });
   navigate('/restablecer-contraseña'); // Redirigir al usuario a la página de restablecimiento
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <div className="w-full">
        <label htmlFor="email" className="block text-white">Correo Electrónico</label>
        <input 
          id="email"
          type="email"
          placeholder="Ingrese su correo electrónico"
          className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="w-full">
        <label htmlFor="cedula" className="block text-white">Cédula</label>
        <input 
          id="cedula"
          type="text"
          placeholder="Ingrese su cédula"
          className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          required
        />
      </div>
      <button 
      onClick={handleSubmit}
        type="submit" 
        className="w-full bg-blue-600 text-white py-3 rounded-full shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Enviar enlace de restablecimiento
      </button>
    </form>
  );
}

export default RequestPasswordForm;
