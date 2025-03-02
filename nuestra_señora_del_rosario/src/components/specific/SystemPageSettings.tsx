import AdminCard from '../microcomponents/AdminCard';

const SystemPageSettings = () =>  {
     return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">⚙ Configuración de la Pagina Informativa</h2>
      <p className="text-gray-600 mb-8">
        Administra los diferentes parámetros de la pagina informativa. Puedes agregar, editar y eliminar información clave.
      </p>

      {/* 📌 GRID de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard title="Imagenes de la Pagina Informativa" description="Gestiona las imagenes de la pagina informativa." route="/dashboard/Configuracion/pagina/imagenes" roles={["Admin"]}/>
     </div>
    </div>
  );
};

export default SystemPageSettings