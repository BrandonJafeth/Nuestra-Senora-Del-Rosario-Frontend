import React from "react";
import AdminCard from "../microcomponents/AdminCard";
import { useThemeDark } from "../../hooks/useThemeDark"; // Importar el hook

const SystemConfiguration: React.FC = () => {
  const { isDarkMode } = useThemeDark(); // Obtener si el modo oscuro está activo

  return (
    <div className={`p-8 transition-all duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <h2 className="text-3xl font-bold mb-6 dark: text-black">⚙ Configuración del Sistema</h2>
      <p className="mb-8 dark:text-black">
        Administra los diferentes parámetros del sistema. Puedes agregar, editar y eliminar información clave.
      </p>

      {/* 📌 GRID de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard title="Estados de Citas Médicas" description="Gestiona los estados de las citas médicas." route="/dashboard/Configuracion/sistema/estado-citas" roles={["Enfermeria"]} isDarkMode={isDarkMode} />
        <AdminCard title="Tipos de Salario" description="Gestiona los diferentes tipos de salario." route="/dashboard/Configuracion/sistema/tipo-salario" roles={["Admin"]} isDarkMode={isDarkMode} />
        <AdminCard title="Unidades de Medida" description="Gestiona las unidades de medida." route="/dashboard/Configuracion/sistema/unidad-medida" roles={["Admin", "Enfermeria"]} isDarkMode={isDarkMode} />
        <AdminCard title="Especialidades Médicas" description="Gestiona las especialidades médicas." route="/dashboard/Configuracion/sistema/especialidad" roles={["Enfermeria"]} isDarkMode={isDarkMode} />
        <AdminCard title="Gestión de Habitaciones" description="Gestiona las habitaciones del centro." route="/dashboard/Configuracion/sistema/habitacion" roles={["Admin"]} isDarkMode={isDarkMode} />
        <AdminCard title="Patologías" description="Gestiona las patologías médicas registradas." route="/dashboard/Configuracion/sistema/patologia" roles={["Enfermeria"]} isDarkMode={isDarkMode} />
        <AdminCard title="Profesiones" description="Gestiona las profesiones registradas." route="/dashboard/Configuracion/sistema/profesion" roles={["Admin"]} isDarkMode={isDarkMode} />
        <AdminCard title="Notas Médicas" description="Gestiona las notas médicas de los pacientes." route="/dashboard/Configuracion/sistema/notas" roles={["Enfermeria"]} isDarkMode={isDarkMode} />
        <AdminCard title="Centros de Salud" description="Gestiona los centros de salud registrados." route="/dashboard/Configuracion/sistema/centro-atencion" roles={["Enfermeria"]} isDarkMode={isDarkMode} />
        <AdminCard title="Niveles de Dependencia" description="Gestiona los niveles de dependencia para los residentes." route="/dashboard/Configuracion/sistema/nivel-dependencia" roles={["Enfermeria", "Admin"]} isDarkMode={isDarkMode} />
        <AdminCard title="Categorías" description="Gestiona las categorías para el inventario." route="/dashboard/Configuracion/sistema/categoria" roles={["Enfermeria", "Admin"]} isDarkMode={isDarkMode} />
        <AdminCard title="Marcas de Activos" description="Gestiona las marcas de los activos." route="/dashboard/Configuracion/sistema/marca" roles={["Enfermeria", "Admin", "Fisioterapia"]} isDarkMode={isDarkMode} />
        <AdminCard title="Modelos de las marcas" description="Gestiona los modelos de las marcas." route="/dashboard/Configuracion/sistema/modelo" roles={["Enfermeria", "Admin", "Fisioterapia"]} isDarkMode={isDarkMode} />
        <AdminCard title="Categorias de los activos" description="Gestiona las categorías de los activos." route="/dashboard/Configuracion/sistema/categoria-activo" roles={["Enfermeria", "Admin", "Fisioterapia"]} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default SystemConfiguration;
