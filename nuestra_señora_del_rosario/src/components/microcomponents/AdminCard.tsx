import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AdminCardProps {
  title: string;
  description: string;
  route: string;
  roles?: string[]; // 📌 Roles permitidos
}

const AdminCard: React.FC<AdminCardProps> = ({ title, description, route, roles }) => {
  const { selectedRole } = useAuth();
  const navigate = useNavigate();

  // 📌 Si la Card tiene roles y el usuario no tiene permisos, no mostrarla
  if (roles && selectedRole && !roles.includes(selectedRole)) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 flex justify-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => navigate(route)}
        >
          Gestionar
        </button>
      </div>
    </div>
  );
};

export default AdminCard;
