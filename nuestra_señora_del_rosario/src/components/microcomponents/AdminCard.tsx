import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AdminCardProps {
  title: string;
  description: string;
  route: string;
  roles?: string[]; // 📌 Roles permitidos
  isDarkMode?: boolean;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, description, route, roles, isDarkMode }) => {
  const { selectedRole } = useAuth();
  const navigate = useNavigate();

  // 📌 Si la Card tiene roles y el usuario no tiene permisos, no mostrarla
  if (roles && selectedRole && !roles.includes(selectedRole)) {
    return null;
  }

  return (
    <div className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
      isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"
    }`}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-white">{description}</p>
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
