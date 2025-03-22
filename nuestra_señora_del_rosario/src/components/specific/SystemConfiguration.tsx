import React, { useState } from "react";
import AdminCard from "../microcomponents/AdminCard";
import { useThemeDark } from "../../hooks/useThemeDark"; // Importar el hook
import { useAuth } from "../../hooks/useAuth";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// 1. Define un arreglo con los datos de tus cards
const cardsData = [
  {
    title: "Estados de Citas Médicas",
    description: "Gestiona los estados de las citas médicas.",
    route: "/dashboard/Configuracion/sistema/estado-citas",
    roles: ["Enfermeria"],
  },
  {
    title: "Tipos de Salario",
    description: "Gestiona los diferentes tipos de salario.",
    route: "/dashboard/Configuracion/sistema/tipo-salario",
    roles: ["Admin"],
  },
  {
    title: "Unidades de Medida",
    description: "Gestiona las unidades de medida.",
    route: "/dashboard/Configuracion/sistema/unidad-medida",
    roles: ["Admin", "Enfermeria"],
  },
  {
    title: "Especialidades Médicas",
    description: "Gestiona las especialidades médicas.",
    route: "/dashboard/Configuracion/sistema/especialidad",
    roles: ["Enfermeria"],
  },
  {
    title: "Gestión de Habitaciones",
    description: "Gestiona las habitaciones del centro.",
    route: "/dashboard/Configuracion/sistema/habitacion",
    roles: ["Admin"],
  },
  {
    title: "Patologías",
    description: "Gestiona las patologías médicas registradas.",
    route: "/dashboard/Configuracion/sistema/patologia",
    roles: ["Enfermeria"],
  },
  {
    title: "Profesiones",
    description: "Gestiona las profesiones registradas.",
    route: "/dashboard/Configuracion/sistema/profesion",
    roles: ["Admin"],
  },
  {
    title: "Notas Médicas",
    description: "Gestiona las notas médicas de los pacientes.",
    route: "/dashboard/Configuracion/sistema/notas",
    roles: ["Enfermeria"],
  },
  {
    title: "Centros de Salud",
    description: "Gestiona los centros de salud registrados.",
    route: "/dashboard/Configuracion/sistema/centro-atencion",
    roles: ["Enfermeria"],
  },
  {
    title: "Niveles de Dependencia",
    description: "Gestiona los niveles de dependencia para los residentes.",
    route: "/dashboard/Configuracion/sistema/nivel-dependencia",
    roles: ["Enfermeria", "Admin"],
  },
  {
    title: "Categorías",
    description: "Gestiona las categorías para el inventario.",
    route: "/dashboard/Configuracion/sistema/categoria",
    roles: [ "Admin"],
  },
  {
    title: "Marcas de Activos",
    description: "Gestiona las marcas de los activos.",
    route: "/dashboard/Configuracion/sistema/marca",
    roles: ["Admin" ],
  },
  {
    title: "Modelos de las marcas",
    description: "Gestiona los modelos de las marcas.",
    route: "/dashboard/Configuracion/sistema/modelo",
    roles: [ "Admin"],
  },
  {
    title: "Categorias de los activos",
    description: "Gestiona las categorías de los activos.",
    route: "/dashboard/Configuracion/sistema/categoria-activo",
    roles: [ "Admin"],
  },
  {
    title: "Leyes",
    description: "Gestiona las leyes aplicables.",
    route: "/dashboard/Configuracion/sistema/leyes",
    roles: ["Admin"],
  },
  {
    title: "Medicamentos",
    description: "Gestiona los medicamentos.",
    route: "/dashboard/Configuracion/sistema/medicamento",
    roles: ["Enfermeria"],
  },
  {
    title: "Vías de Administración",
    description: "Gestiona las vías de administración de medicamentos.",
    route: "/dashboard/Configuracion/sistema/via-administracion",
    roles: ["Enfermeria"],
  },
];

const SystemConfiguration: React.FC = () => {
  const { isDarkMode } = useThemeDark();
  // Si tienes un hook de Auth:
  const { selectedRole } = useAuth();


  // 1. Filtrar según el rol del usuario
  const filteredCards = selectedRole ? cardsData.filter((card) =>
    card.roles.includes(selectedRole)
  ) : [];

  // 2. Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalCards = filteredCards.length;
  const totalPages = Math.ceil(totalCards / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleCards = filteredCards.slice(startIndex, endIndex);

  // Manejadores de paginación
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div
      className={`p-8 transition-all duration-300 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6">⚙ Configuración del Sistema</h2>
      <p className="mb-8">
        Administra los diferentes parámetros del sistema. Puedes agregar, editar
        y eliminar información clave.
      </p>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCards.map((card, idx) => (
          <AdminCard
            key={idx}
            title={card.title}
            description={card.description}
            route={card.route}
            roles={card.roles}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Controles de Paginación */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-full ${
            currentPage === 1
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
        >
          <FaArrowLeft/>
        </button>

        <span>
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-full ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
        >
          <FaArrowRight/>
        </button>
      </div>
    </div>
  );
};

export default SystemConfiguration;
