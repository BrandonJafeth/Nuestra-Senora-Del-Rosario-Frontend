import React from "react";
import AdminCard from "../microcomponents/AdminCard";

const SystemConfiguration: React.FC = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">⚙ Configuración del Sistema</h2>
      <p className="text-gray-600 mb-8">
        Administra los diferentes parámetros del sistema. Puedes agregar, editar y eliminar información clave.
      </p>

      {/* 📌 GRID de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard title="Estados de Citas Médicas" description="Gestiona los estados de las citas médicas." route="/Configuracion/sistema/estado-citas" roles={["Enfermeria"]}/>
        <AdminCard title="Tipos de Salario" description="Gestiona los diferentes tipos de salario." route="/dashboard/Configuracion/sistema/tipo-salario" roles={["Admin"]}/>
        <AdminCard title="Unidades de Medida" description="Gestiona las unidades de medida." route="/Configuracion/sistema/unidad-medida" roles={["Admin", "Enfermeria"]}/>
        <AdminCard title="Especialidades Médicas" description="Gestiona las especialidades médicas." route="/Configuracion/sistema/especialidad" roles={["Enfermeria"]}/>
        <AdminCard title="Gestión de Habitaciones" description="Gestiona las habitaciones del centro." route="/Configuracion/sistema/habitacion" roles={["Admin"]}/>
        <AdminCard title="Patologías" description="Gestiona las patologías médicas registradas." route="/Configuracion/sistema/patologia" roles={["Enfermeria"]}/>
        <AdminCard title="Profesiones" description="Gestiona las profesiones registradas." route="/Configuracion/sistema/profesion" roles={["Admin"]}/>
        <AdminCard title="Notas Médicas" description="Gestiona las notas médicas de los pacientes." route="/Configuracion/sistema/notas" roles={["Enfermeria"]}/>
        <AdminCard title="Centros de Salud" description="Gestiona los centros de salud registrados." route="/Configuracion/sistema/centro-atencion" roles={["Enfermeria"]}/>
        <AdminCard title="Niveles de Dependencia" description="Gestiona los niveles de dependencia para los residentes." route="/Configuracion/sistema/nivel-dependencia" roles={["Enfermeria", "Admin"]}/>
      </div>
    </div>
  );
};

export default SystemConfiguration;
