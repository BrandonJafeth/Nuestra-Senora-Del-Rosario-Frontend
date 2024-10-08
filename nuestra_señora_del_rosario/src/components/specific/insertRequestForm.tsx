import React, { useState } from 'react';
import { useInsertRequestForm } from '../../hooks/useInsertRequestForm';

const InsertRequestForm = ({ onRequestAdded, onClose }: { onRequestAdded: () => void, onClose: () => void }) => {
  const {
    name_AP,
    lastname1_AP,
    lastname2_AP,
    age_AP,
    cedula_AP,
    location,
    name_GD,
    cedula_GD,
    phone_GD,
    setName_AP,
    setLastname1_AP,
    setLastname2_AP,
    setAge_AP,
    setCedula_AP,
    setLocation,
    setName_GD,
    setCedula_GD,
    setPhone_GD,
    handleSubmit,
    isLoading,
    isError,
    error,
  } = useInsertRequestForm();

  const [currentStep, setCurrentStep] = useState(1); // Para manejar las pantallas del formulario

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2); // Ir a la pantalla del encargado
  };

  const handlePreviousStep = () => {
    setCurrentStep(1); // Volver a la pantalla del residente
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      onRequestAdded();
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto bg-white p-8 shadow-lg rounded-lg relative">
      {/* Botón de cierre */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>

      {currentStep === 1 ? (
        // Pantalla 1: Datos del Residente
        <>
          <h2 className="text-2xl font-bold mb-6">Añadir Nuevo Residente</h2>
          <form onSubmit={handleNextStep} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={name_AP}
                onChange={(e) => setName_AP(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Primer Apellido</label>
              <input
                type="text"
                value={lastname1_AP}
                onChange={(e) => setLastname1_AP(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Segundo Apellido</label>
              <input
                type="text"
                value={lastname2_AP}
                onChange={(e) => setLastname2_AP(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Edad</label>
              <input
                type="number"
                value={age_AP}
                onChange={(e) => setAge_AP(parseInt(e.target.value))}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Cédula</label>
              <input
                type="text"
                value={cedula_AP}
                onChange={(e) => setCedula_AP(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Domicilio</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Siguiente
              </button>
            </div>
          </form>
        </>
      ) : (
        // Pantalla 2: Datos del Encargado
        <>
          <h2 className="text-2xl font-bold mb-6">Datos del Encargado</h2>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Nombre del Encargado</label>
              <input
                type="text"
                value={name_GD}
                onChange={(e) => setName_GD(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Cédula del Encargado</label>
              <input
                type="text"
                value={cedula_GD}
                onChange={(e) => setCedula_GD(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Teléfono del Encargado</label>
              <input
                type="text"
                value={phone_GD}
                onChange={(e) => setPhone_GD(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            {isError && <p className="text-red-500 col-span-2">{error as any}</p>}

            {/* Botones centrados */}
            <div className="col-span-2 flex justify-between">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Volver
              </button>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Añadiendo...' : 'Añadir Residente'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default InsertRequestForm;
