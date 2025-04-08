import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const RoleSelection: React.FC = () => {
  const { payload, setRole, logout } = useAuth();
  const navigate = useNavigate();

  // Convertir el rol o roles en un array seguro.
  const userRoles: string[] = Array.isArray(
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
  )
    ? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    : payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    ? [payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]]
    : [];

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Si solo hay un rol, se asigna automáticamente y se redirige.
  useEffect(() => {
    if (userRoles.length === 1) {
      const singleRole = userRoles[0];
      setSelectedRole(singleRole);
      setRole(singleRole);
      navigate("/dashboard");
    }
  }, [userRoles, setRole, navigate]);

  const handleSelectRole = () => {
    if (!selectedRole) return;
    setRole(selectedRole);
    navigate("/dashboard");
  };

  const handleCancel = () => {
    logout();
    navigate("/");
  };

  // Si el usuario solo tiene un rol, mostramos un mensaje de redirección.
  if (userRoles.length === 1) {
    return <div className="flex items-center justify-center min-h-screen">Redirigiendo...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://i.ibb.co/TwbrSPf/Icon-whitout-fondo.png"
            alt="Logo"
            className="h-16"
          />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-2">
          Seleccionar rol
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Tienes múltiples roles. Por favor, selecciona uno para continuar.
        </p>

        {/* Lista de roles */}
        <div className="space-y-3">
          {userRoles.map((role) => (
            <label
              key={role}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"
            >
              <input
                type="radio"
                name="role"
                value={role}
                checked={selectedRole === role}
                onChange={() => setSelectedRole(role)}
                className="form-radio text-blue-600 dark:text-blue-400"
              />
              <span className="text-gray-800 dark:text-white">{role}</span>
            </label>
          ))}
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-5 mt-6">
          <button
            onClick={handleCancel}
            className="w-1/3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSelectRole}
            disabled={!selectedRole}
            className="w-1/3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
