// FILE: components/InventoryTable.tsx
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useThemeDark } from '../../hooks/useThemeDark';
import 'react-loading-skeleton/dist/skeleton.css';
import InventoryReportViewer from '../microcomponents/InventoryReportViewer';
import InventoryMovementForm from './InventoryMovementForm';
import ProductAddModal from './AddProductModal';
import ProductEditModal from './ModalEditProduct';
import { Product } from '../../types/ProductType';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useProductsByCategory } from '../../hooks/useProductByCategory';
import CategoryDropdown from '../microcomponents/CategoryDropdown';
import ConvertProductModal from '../microcomponents/ConvertProductModal';

const InventoryTable: React.FC = () => {
  const { isDarkMode } = useThemeDark();
  
  // Paginación
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;

  // Categoría
  const [categoryId, setCategoryId] = useState<number>(0);

  // Hook para obtener productos por categoría
  const { data, isLoading: productsLoading, isError: productsError } = useProductsByCategory(categoryId, pageNumber, pageSize);

  const products = data?.item1 || [];
  const totalPages = data?.item2 || 1;

  // Manejo de modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modal de Conversión
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertData, setConvertData] = useState<{ productId: number; targetUnit: string } | null>(null);

  // Abre modal de movimientos
  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Abre modal de agregar producto
  const openProductModal = () => {
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  // Abre modal de editar producto
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  // Abre modal de conversión
  const openConvertModal = (product: Product) => {
    // Ejemplo: usaremos la unidad de medida actual del producto como "targetUnit"
    // o si tienes otra lógica, ajusta aquí
    setConvertData({
      productId: product.productID,
      targetUnit: product.unitOfMeasure, 
    });
    setIsConvertModalOpen(true);
  };

  const closeConvertModal = () => {
    setIsConvertModalOpen(false);
    setConvertData(null);
  };

  // Paginación
  const handleNextPage = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleCategorySelect = (selectedId: number) => {
    setCategoryId(selectedId);
    setPageNumber(1);
  };

  // Render mientras carga
  if (productsLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-[#0D313F] border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
              <th className="py-2 px-4 border dark:border-gray-500">Producto</th>
              <th className="py-2 px-4 border dark:border-gray-500">Unidad de medida</th>
              <th className="py-2 px-4 border dark:border-gray-500">Cantidad</th>
              <th className="py-2 px-4 border dark:border-gray-500">Categoria</th>
              <th className="py-2 px-4 border dark:border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={100} />
                </td>
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={100} />
                </td>
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={60} />
                </td>
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={80} />
                </td>
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={80} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Error
  if (productsError)
    return (
      <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Error al cargar los productos.
      </p>
    );

  return (
    <div
      className={`w-full max-w-[1169px] mx-auto p-6 ${
        isDarkMode ? 'bg-[#0D313F]' : 'bg-white'
      } rounded-[20px] shadow-2xl relative`}
    >
      {/* Botón para agregar producto */}
      <div className="absolute top-4 left-4">
        <button
          onClick={openProductModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
        >
          Agregar Producto
        </button>
      </div>

      {/* Dropdown de categorías y visor de reportes */}
      <div className="absolute flex gap-3 top-4 right-4">
        <CategoryDropdown onCategorySelect={handleCategorySelect} />
        <InventoryReportViewer
          month={new Date().getMonth() + 1}
          year={new Date().getFullYear()}
        />
      </div>

      <h2
        className={`text-3xl font-bold mb-8 text-center font-poppins ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Inventario
      </h2>

      {/* Tabla de Productos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent rounded-lg shadow-md">
          <thead>
            <tr
              className={`${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              } text-center`}
            >
              <th className="p-4 border dark:border-gray-500">Producto</th>
              <th className="p-4 border dark:border-gray-500">Unidad de medida</th>
              <th className="p-4 border dark:border-gray-500">Cantidad</th>
              <th className="p-4 border dark:border-gray-500">Categoria</th>
              <th className="p-4 border dark:border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products.map((item: Product) => (
              <tr
                key={item.productID}
                className={`${
                  isDarkMode
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-white text-gray-800 hover:bg-gray-200'
                }`}
              >
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                  {item.name}
                </td>
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                  {item.unitOfMeasure || 'N/A'}
                </td>
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                  {item.totalQuantity}
                </td>
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                  {item.categoryName || 'N/A'}
                </td>
                <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                  {/* Botón Agregar Movimiento */}
                  <button
                    onClick={() => openModal(item)}
                    className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
                  >
                    Agregar Producto
                  </button>

                  {/* Botón Editar */}
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-4 py-2 mr-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition duration-200"
                  >
                    Editar
                  </button>

                  {/* Botón Convertir Producto */}
                  <button
                    onClick={() => openConvertModal(item)}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200"
                  >
                    Convertir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={pageNumber === 1}
          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
        >
          <FaArrowLeft />
        </button>

        <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Página {pageNumber} de {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={pageNumber === totalPages}
          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Modal para movimientos */}
      {selectedProduct && (
        <InventoryMovementForm
          isOpen={isModalOpen}
          onClose={closeModal}
          productID={selectedProduct.productID}
        />
      )}

      {/* Modal para agregar producto */}
      <ProductAddModal isOpen={isProductModalOpen} onRequestClose={closeProductModal} />

      {/* Modal para editar producto */}
      {selectedProduct && (
        <ProductEditModal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          productId={selectedProduct.productID}
          initialProductData={selectedProduct}
        />
      )}

      {/* Modal para convertir producto */}
      {convertData && (
        <ConvertProductModal
          isOpen={isConvertModalOpen}
          onRequestClose={closeConvertModal}
          productId={convertData.productId}
          targetUnit={convertData.targetUnit}
        />
      )}
    </div>
  );
};

export default InventoryTable;
