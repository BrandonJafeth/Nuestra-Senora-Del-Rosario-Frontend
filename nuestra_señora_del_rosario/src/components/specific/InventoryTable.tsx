// components/InventoryTable.tsx
import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import Skeleton from 'react-loading-skeleton';
import { useThemeDark } from '../../hooks/useThemeDark';
import 'react-loading-skeleton/dist/skeleton.css';
import InventoryReportViewer from '../microcomponents/InventoryReportViewer';


const InventoryTable: React.FC = () => {
  const { data: products, isLoading: productsLoading, isError: productsError } = useProducts();
  const { isDarkMode } = useThemeDark(); // Dark mode state

  // Obtener el mes y año actuales
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Show skeletons if loading
  if (productsLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-[#0D313F] border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
              <th className="py-2 px-4 border dark:border-gray-500">Inventory ID</th>
              <th className="py-2 px-4 border dark:border-gray-500">Producto</th>
              <th className="py-2 px-4 border dark:border-gray-500">Cantidad</th>
              <th className="py-2 px-4 border dark:border-gray-500">Fecha</th>
              <th className="py-2 px-4 border dark:border-gray-500">Categoria</th>
              <th className="py-2 px-4 border dark:border-gray-500">Unidad de medida</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border dark:border-gray-500"><Skeleton width={80} /></td>
                <td className="py-2 px-4 border dark:border-gray-500"><Skeleton width={100} /></td>
                <td className="py-2 px-4 border dark:border-gray-500"><Skeleton width={60} /></td>
                <td className="py-2 px-4 border dark:border-gray-500"><Skeleton width={100} /></td>
                <td className="py-2 px-4 border dark:border-gray-500"><Skeleton width={80} /></td>
                <td className="py-2 px-4 border dark:border-gray-500"><Skeleton width={100} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Show error message if loading failed
  if (productsError) return <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Failed to load data.</p>;

  // Render actual data once loaded
  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      {/* Botón para generar el reporte en PDF en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <InventoryReportViewer month={currentMonth} year={currentYear} />
      </div>

      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Inventario
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent rounded-lg shadow-md">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} text-center`}>
              <th className="p-4 border dark:border-gray-500">Producto</th>
              <th className="p-4 border dark:border-gray-500">Unidad de medida</th>
              <th className="p-4 border dark:border-gray-500">Cantidad</th>
              <th className="p-4 border dark:border-gray-500">Categoria</th>
              <th className="p-4 border dark:border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products?.map((item) => (
              <tr
                key={item.productID}
                className={`${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
              >
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">{item.name}</td>
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">{item.unitOfMeasure || 'N/A'}</td>
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">{item.totalQuantity}</td>
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">{item.categoryName || 'N/A'}</td>
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
