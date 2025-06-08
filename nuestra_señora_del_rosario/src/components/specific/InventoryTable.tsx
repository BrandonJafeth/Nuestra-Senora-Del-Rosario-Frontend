import React, { useState, useEffect } from "react";
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
import { useAllProductsByCategory } from "../../hooks/useAllProductsByCategory";
import CategoryDropdown from "../microcomponents/CategoryDropdown";
import { ConvertedData } from "../../types/ProductType";
import SearchInput from "../common/SearchInput";

const InventoryTable: React.FC = () => {
  const { isDarkMode } = useThemeDark();

  // Paginación
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;

  // Categoría seleccionada (0 = ninguna)
  const [categoryId, setCategoryId] = useState<number>(0);  // Llamada a la query para obtener productos paginados (para visualización)
  const {
    data: paginatedData,
    isLoading: productsLoading,
    isError: productsError,
  } = useProductsByCategory(categoryId, pageNumber, pageSize);

  // Llamada a la query para obtener TODOS los productos de la categoría (para búsqueda global)
  const {
    data: allCategoryProducts,
    isLoading: allProductsLoading,
    isError: allProductsError,
  } = useAllProductsByCategory(categoryId);

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado compuesto para la carga
  const isLoading = productsLoading || allProductsLoading;
  const isError = productsError || allProductsError;
  
  // Estado para almacenar productos paginados y filtrados para mostrar
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  // Estado para el total de páginas según la búsqueda
  const [totalPages, setTotalPages] = useState(1);

  // Manejo de modales...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estado para almacenar productos convertidos
  const [convertedProducts, setConvertedProducts] = useState<{
    [id: number]: { unitOfMeasure: string; totalQuantity: number };
  }>({});

  // Filtrado y paginación de productos
  useEffect(() => {
    // Si hay un término de búsqueda, filtramos en todos los productos
    if (searchTerm.trim()) {
      const filtered = (allCategoryProducts || []).filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Calcular el total de páginas basado en los resultados filtrados
      const calculatedTotalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      setTotalPages(calculatedTotalPages);
      
      // Ajustar página actual si excede el total de páginas
      const adjustedPageNumber = Math.min(pageNumber, calculatedTotalPages);
      if (adjustedPageNumber !== pageNumber) {
        setPageNumber(adjustedPageNumber);
      }
      
      // Paginar los resultados filtrados
      const start = (adjustedPageNumber - 1) * pageSize;
      const end = start + pageSize;
      setDisplayProducts(filtered.slice(start, end));
    } else {
      // Si no hay término de búsqueda, usamos los datos paginados del servidor
      setDisplayProducts(paginatedData?.item1 || []);
      setTotalPages(paginatedData?.item2 || 1);
    }
  }, [searchTerm, allCategoryProducts, paginatedData, pageNumber, pageSize]);
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
     <div className="mb-4 justify-center items-center flex">
            <div className="w-full max-w-md">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por cédula, nombre o correo en todos los usuarios"
                isDarkMode={isDarkMode}
                className="w-full"
              />
            </div>
          </div>      {categoryId === 0 ? (
        <p className="text-center mt-4 font-medium text-lg dark:text-white text-gray-800">
          Seleccione una categoría para ver los productos.
        </p>
      ) : isLoading ? (
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
        </div>      ) : isError ? (
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
              </thead>              <tbody className="text-center">
                {displayProducts.map((item: Product) => {
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
