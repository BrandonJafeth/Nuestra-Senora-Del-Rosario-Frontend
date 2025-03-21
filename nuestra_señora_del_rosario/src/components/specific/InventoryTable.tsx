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
import { ConvertedData } from '../../types/ProductType';

const InventoryTable: React.FC = () => {
  const { isDarkMode } = useThemeDark();

  // Paginación
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;

  // Categoría seleccionada (0 = ninguna)
  const [categoryId, setCategoryId] = useState<number>(0);

  // Llamada a la query, pero solo si categoryId != 0
  const { data, isLoading: productsLoading, isError: productsError } =
    useProductsByCategory(categoryId, pageNumber, pageSize, {
      // Si tu hook lo permite, puedes usar 'enabled' para no hacer la query cuando categoryId=0
      // enabled: categoryId !== 0
    });

  const products = data?.item1 || [];
  const totalPages = data?.item2 || 1;

  // Manejo de modales...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modal de Conversión...
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertData, setConvertData] =
    useState<{ productId: number; targetUnit: string } | null>(null);

  // Estado para almacenar productos convertidos
  const [convertedProducts, setConvertedProducts] = useState<{
    [id: number]: { unitOfMeasure: string; totalQuantity: number };
  }>({});

  // Función para actualizar el producto con datos convertidos
  const handleConversionComplete = (updatedData: ConvertedData) => {
    setConvertedProducts((prevState) => ({
      ...prevState,
      [updatedData.productID]: {
        unitOfMeasure: updatedData.convertedUnitOfMeasure,
        totalQuantity: updatedData.convertedTotalQuantity,
      },
    }));
  };

  // Funciones para abrir/cerrar modales
  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const openProductModal = () => {
    setIsProductModalOpen(true);
  };
  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const openConvertModal = (product: Product) => {
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

  // Cuando el usuario elige otra categoría en el dropdown
  const handleCategorySelect = (selectedId: number) => {
    setCategoryId(selectedId);
    setPageNumber(1);
  };

  return (
    <div
      className={`
        relative w-full max-w-[1169px] mx-auto px-4 py-6 sm:px-2 sm:py-4
        ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} 
        rounded-[20px] shadow-2xl
      `}
    >
      {/* Sección superior */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        {/* Botón "Agregar Producto" */}
        <button
          onClick={openProductModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
        >
          Agregar Producto
        </button>

        {/* Dropdown y visor de reportes */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <CategoryDropdown
            selectedCategory={categoryId}
            onCategorySelect={handleCategorySelect}
          />
          <InventoryReportViewer
            month={new Date().getMonth() + 1}
            year={new Date().getFullYear()}
          />
        </div>
      </div>

      <h2
        className={`text-3xl font-bold mb-6 text-center font-poppins ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Inventario
      </h2>
      {categoryId === 0 ? (
        <p className="text-center mt-4 font-medium text-lg">
          Seleccione una categoría para ver los productos.
        </p>
      ) : productsLoading ? (
        // Skeleton
        <div className="overflow-x-auto px-4 sm:px-2">
          <table className="min-w-full bg-white dark:bg-[#0D313F] border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                <th className="py-2 px-4 border dark:border-gray-500">Producto</th>
                <th className="py-2 px-4 border dark:border-gray-500">Unidad de medida</th>
                <th className="py-2 px-4 border dark:border-gray-500">Cantidad</th>
                <th className="py-2 px-4 border dark:border-gray-500">Categoría</th>
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
      ) : productsError ? (
        <p className={`px-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Error al cargar los productos.
        </p>
      ) : (
        <>
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
                  <th className="p-4 border dark:border-gray-500">Categoría</th>
                  <th className="p-4 border dark:border-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {products.map((item: Product) => {
                  // Si existe conversión para este producto, se muestran los datos convertidos
                  const converted = convertedProducts[item.productID];
                  return (
                    <tr
                      key={item.productID}
                      className={`${
                        isDarkMode
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-white text-gray-800 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                        {item.name}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                        {converted
                          ? converted.unitOfMeasure
                          : item.unitOfMeasure || 'N/A'}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                        {converted ? converted.totalQuantity : item.totalQuantity}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                        {item.categoryName || 'N/A'}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                        {/* Botón Agregar Movimiento */}
                        <button
                          onClick={() => openModal(item)}
                          className="px-4 py-2 mr-2 mb-2 sm:mb-0 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
                        >
                          Movimiento
                        </button>

                        {/* Botón Editar */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-4 py-2 mr-2 mb-2 sm:mb-0 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition duration-200"
                        >
                          Editar
                        </button>

                        {/* Botón Convertir (sólo para "leche") */}
                        {item.name.toLowerCase() === 'leche' && (
                          <button
                            onClick={() => openConvertModal(item)}
                            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200"
                          >
                            Convertir
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-center items-center mt-6 space-x-4">
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
        </>
      )}

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
          onConversionComplete={handleConversionComplete}
        />
      )}
    </div>
  );
};

export default InventoryTable;
