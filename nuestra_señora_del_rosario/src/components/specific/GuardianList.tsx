import React, { useState, useMemo } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { FaArrowLeft, FaArrowRight, FaSearch } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useGetAllGuardians } from '../../hooks/useGetAllGuardians';
import GuardianFormModal from '../microcomponents/GuardianFormModal';
import GuardianEditModal from '../microcomponents/GuardianEditModal';
import { Guardian } from '../../types/GuardianType';

const GuardianList: React.FC = () => {
  const { data: guardians = [], isLoading, isError, error } = useGetAllGuardians();
  const { isDarkMode } = useThemeDark();

  // Estado para página actual y cantidad de elementos por página
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);

  if (isError) return <p>Error al cargar encargados: {error?.message}</p>;

  // Calcular total de páginas usando pageSize
  const totalPages = Math.ceil(guardians.length / pageSize);
  const currentPageData = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return guardians.slice(start, start + pageSize);
  }, [guardians, pageNumber, pageSize]);

  return (
    <>
      <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${ isDarkMode ? 'bg-[#0D313F]' : 'bg-white' }`}>
        {/* Header con dropdown y botón de nuevo */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold ${ isDarkMode ? 'text-white' : 'text-gray-900' }`}>
            Encargados Legales
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all"
            >
              Nuevo Encargado
            </button>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNumber(1); // Reiniciar a la página 1 al cambiar cantidad
              }}
              className={`p-2 border rounded-lg ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-transparent rounded-lg">
            <thead>
              <tr className={`text-center ${ isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800' }`}>
                <th className="p-4">Cédula</th>
                <th className="p-4">Nombre completo</th>
                <th className="p-4">Email</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {isLoading
                ? Array.from({ length: pageSize }).map((_, i) => (
                    <tr key={i}>
                      {Array(5).fill('').map((__, j) => (
                        <td key={j} className="p-4">
                          <Skeleton height={20} width="80%" />
                        </td>
                      ))}
                    </tr>
                  ))
                : currentPageData.length > 0
                ? currentPageData.map((g: any) => (
                    <tr
                      key={g.id_Guardian}
                      className={`${
                        isDarkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-white text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <td className="p-4">{g.cedula_GD}</td>
                      <td className="p-4">{`${g.name_GD} ${g.lastname1_GD} ${g.lastname2_GD}`}</td>
                      <td className="p-4">{g.email_GD}</td>
                      <td className="p-4">{g.phone_GD}</td>
                      <td className="p-4 flex space-x-2 justify-center">
                         <button
                          onClick={() => {
                            setSelectedGuardian(g);
                            setIsEditModalOpen(true);
                          }}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                : (
                  <tr>
                    <td colSpan={5} className="py-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-4xl mb-2 text-gray-400">
                          <FaSearch />
                        </div>
                        <p className={`text-base ${ isDarkMode ? 'text-gray-300' : 'text-gray-600' }`}>
                          No se encontraron encargados
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber === 1}
            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaArrowLeft />
          </button>
          <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Página {pageNumber} de {totalPages || 1}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(p + 1, totalPages))}
            disabled={pageNumber === totalPages || totalPages === 0}
            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
      <GuardianFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
{ selectedGuardian && (
   <GuardianEditModal
     isOpen={isEditModalOpen}
     onClose={() => setIsEditModalOpen(false)}
   guardian={selectedGuardian}   // ahora siempre es un Guardian, nunca null
   />
 ) }
    </>
  );
};

export default GuardianList;