import React, { useState } from "react";
import Modal from "react-modal";
import Select, { SingleValue } from "react-select";
import { InventoryMovement } from "../../types/InventoryMovement";
import { useProducts } from "../../hooks/useProducts";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useToast } from "../../hooks/useToast";
import Toast from "../common/Toast";
import { useCreateInventoryMovement } from "../../hooks/useInventoryMovement";

interface ProductRequestModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: (movement: InventoryMovement) => Promise<void>;
}

interface ProductOption {
  value: number;
  label: string;
}

const customStyles = {
  control: (base: any) => ({
    ...base,
    padding: "2px",
    borderRadius: "0.375rem",
    borderColor: "#D1D5DB",
    backgroundColor: "white",
    "&:hover": { borderColor: "#A3A3A3" },
  }),
  option: (base: any, { isFocused }: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: isFocused ? "#E5E7EB" : "white",
    color: "black",
  }),
};

const ProductRequestModal: React.FC<ProductRequestModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const { isDarkMode } = useThemeDark();
  const [selectedProductID, setSelectedProductID] = useState<number | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [productsToEgress, setProductsToEgress] = useState<InventoryMovement[]>(
    []
  );

  const { data, isLoading } = useProducts(1, 10);
  const createInventoryMovement = useCreateInventoryMovement();
  const { showToast, message, type } = useToast();

  // Agregar producto a la lista de egreso
  const handleAddProduct = () => {
    if (selectedProductID && quantity > 0) {
      const newProduct: InventoryMovement = {
        productID: selectedProductID,
        quantity,
        date: new Date().toISOString(),
        movementType: "Egreso",
      };

      setProductsToEgress([...productsToEgress, newProduct]);
      setSelectedProductID(null);
      setQuantity(1);
    } else {
      showToast("Por favor, selecciona un producto y cantidad válida.", "error");
    }
  };

  // Eliminar producto de la lista antes de confirmar
  const handleRemoveProduct = (index: number) => {
    setProductsToEgress(productsToEgress.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (productsToEgress.length === 0) {
      showToast("Agrega al menos un producto para registrar el egreso.", "error");
      return;
    }
  
    const formattedMovements = productsToEgress.map((product) => ({
      productID: product.productID,
      quantity: product.quantity,
      date: new Date().toISOString(), // ✅ Asegurar formato correcto
      movementType: "Egreso", // ✅ Tipo de movimiento fijo
    }));
  
    createInventoryMovement.mutate(formattedMovements, {
      onSuccess: () => {
        showToast("Egreso registrado exitosamente.", "success");
        setTimeout(() => {
          onRequestClose();
          setProductsToEgress([]); // 🔄 Limpiar lista después de cerrar
        }, 2000);
      },
      onError: (error) => {
        console.error("Error en la solicitud:", error);
        showToast("Hubo un error al registrar el egreso.", "error");
      },
    });
  };
  

  // Mapeo de productos para el dropdown
  const options: ProductOption[] =
    data?.products.map((product) => ({
      value: product.productID,
      label: `${product.name} (${product.unitOfMeasure})`,
    })) || [];

  const selectedOption =
    options.find((option) => option.value === selectedProductID) || null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Pedir Producto"
        className={`relative z-50 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Registrar Egreso de Productos
        </h2>
        <form className="space-y-4">
          {/* Dropdown para seleccionar el producto */}
          <div>
            <label htmlFor="product" className="block text-sm font-medium">
              Producto
            </label>
            <Select
              id="product"
              options={options}
              value={selectedOption}
              onChange={(selected: SingleValue<ProductOption>) =>
                setSelectedProductID(selected?.value ?? null)
              }
              styles={customStyles}
              placeholder="Selecciona un producto"
              isSearchable
              isLoading={isLoading}
            />
          </div>
          {/* Input para cantidad */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium">
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
              required
            />
          </div>
          {/* Botón para agregar producto a la lista */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddProduct}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-200"
            >
              Agregar Producto
            </button>
          </div>

          {/* Tabla de productos a egresar */}
          {productsToEgress.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Productos a egresar:</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 py-1">Producto</th>
                    <th className="border border-gray-300 px-2 py-1">Cantidad</th>
                    <th className="border border-gray-300 px-2 py-1">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productsToEgress.map((prod, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-2 py-1">
                        {options.find((opt) => opt.value === prod.productID)?.label}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">{prod.quantity}</td>
                      <td className="border border-gray-300 px-2 py-1">
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Botón para confirmar el egreso */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
            >
              Registrar Egreso
            </button>
          </div>
        </form>
      </Modal>

      {/* Mostrar el Toast */}
      {message && <Toast message={message} type={type} />}
    </>
  );
};

export default ProductRequestModal;
