import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useThemeDark } from "../../hooks/useThemeDark";
import "react-loading-skeleton/dist/skeleton.css";
import InventoryReportViewer from "../microcomponents/InventoryReportViewer";
import InventoryMovementForm from "./InventoryMovementForm";
import ProductAddModal from "./AddProductModal";
import ProductEditModal from "./ModalEditProduct";
import { Product } from "../../types/ProductType";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useProductsByCategory } from "../../hooks/useProductByCategory";
import CategoryDropdown from "../microcomponents/CategoryDropdown";
import { ConvertedData } from "../../types/ProductType";

const InventoryTable: React.FC = () => {
  const { isDarkMode } = useThemeDark();

  // Paginación
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;

  // Categoría seleccionada (0 = ninguna)
  const [categoryId, setCategoryId] = useState<number>(0);

  // Llamada a la query, pero solo si categoryId != 0
  const {
    data,
    isLoading: productsLoading,
    isError: productsError,
  } = useProductsByCategory(categoryId, pageNumber, pageSize);

  const products = data?.item1 || [];
  const totalPages = data?.item2 || 1;
  const [searchTerm, setSearchTerm] = useState("");

  // Manejo de modales...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estado para almacenar productos convertidos
  const [convertedProducts, setConvertedProducts] = useState<{
    [id: number]: { unitOfMeasure: string; totalQuantity: number };
  }>({});

  const filteredProducts = searchTerm.trim()
    ? products.filter((asset: Product) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;
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
        ${isDarkMode ? "bg-[#0D313F]" : "bg-white"} 
        rounded-[20px] shadow-2xl
      `}
    >
      {/* Fila 1: Título, Botón, Dropdown y Visor de Reportes */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Sección izquierda: Título + Botón */}
        <div className="flex items-center gap-4">
          <button
            onClick={openProductModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
          >
            Agregar Producto
          </button>
          <h2
            className={`text-3xl ml-64 font-bold font-poppins ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Inventario
          </h2>
        </div>

        {/* Sección derecha: Dropdown y visor de reportes */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
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

      {/* Fila 2: Input de Búsqueda */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 ${
            isDarkMode
              ? "bg-gray-700 text-white focus:ring-blue-400"
              : "bg-white text-gray-700 focus:ring-blue-600"
          }`}
        />
      </div>

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
                <th className="py-2 px-4 border dark:border-gray-500">
                  Producto
                </th>
                <th className="py-2 px-4 border dark:border-gray-500">
                  Unidad de medida
                </th>
                <th className="py-2 px-4 border dark:border-gray-500">
                  Cantidad
                </th>
                <th className="py-2 px-4 border dark:border-gray-500">
                  Categoría
                </th>
                <th className="py-2 px-4 border dark:border-gray-500">
                  Acciones
                </th>
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
        <p className={`px-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
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
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-800"
                  } text-center`}
                >
                  <th className="p-4 border dark:border-gray-500">Producto</th>
                  <th className="p-4 border dark:border-gray-500">
                    Unidad de medida
                  </th>
                  <th className="p-4 border dark:border-gray-500">Cantidad</th>
                  <th className="p-4 border dark:border-gray-500">Categoría</th>
                  <th className="p-4 border dark:border-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredProducts.map((item: Product) => {
                  // Si existe conversión para este producto, se muestran los datos convertidos
                  const converted = convertedProducts[item.productID];
                  return (
                    <tr
                      key={item.productID}
                      className={`${
                        isDarkMode
                          ? "bg-gray-600 text-white hover:bg-gray-700"
                          : "bg-white text-gray-800 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                        {item.name}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                        {converted
                          ? converted.unitOfMeasure
                          : item.unitOfMeasure || "N/A"}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                        {converted
                          ? converted.totalQuantity
                          : item.totalQuantity}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
                        {item.categoryName || "N/A"}
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

            <span className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
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
      <ProductAddModal
        isOpen={isProductModalOpen}
        onRequestClose={closeProductModal}
      />

      {/* Modal para editar producto */}
      {selectedProduct && (
       <ProductEditModal
  isOpen={isEditModalOpen}
  onRequestClose={closeEditModal}
  productId={selectedProduct.productID}
  initialProductData={selectedProduct}
  onConversionComplete={handleConversionComplete}  // ← importante
/>

      )}

    </div>
  );
};

export default InventoryTable;
