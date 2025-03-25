// FILE: src/components/RoleBasedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


interface RoleBasedRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles, children }) => {
  const { selectedRole, isAuthenticated } = useAuth();
  const location = useLocation();

  // Si no está autenticado, redirige a la página de login u otra
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si el rol actual no está en la lista de roles permitidos, muestra una página 401
  if (selectedRole && !allowedRoles.includes(selectedRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-red-600">401 Inautorizado</h1>
        <p className="mt-4 text-lg">No tienes permiso para acceder a esta página.</p>
      </div>
    );
  }

  return children;
};

export default RoleBasedRoute;
