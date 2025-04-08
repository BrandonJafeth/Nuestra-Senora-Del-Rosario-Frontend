// FILE: src/components/ProductRequestModal.tsx
import React, { useState } from "react";
import Modal from "react-modal";
import { InventoryMovement } from "../../types/InventoryMovement";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useToast } from "../../hooks/useToast";
import Toast from "../common/Toast";
import { useCreateInventoryMovement } from "../../hooks/useInventoryMovement";
import ProductDropdownByCategory from "../microcomponents/ProductDropdownByCategory";

// Solo para la UI, extendemos InventoryMovement con un campo productName
interface InventoryMovementWithName extends InventoryMovement {
  productName: string;
}

interface ProductRequestModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: (movement: InventoryMovement) => Promise<void>;
}

const ProductRequestModal: React.FC<ProductRequestModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const { isDarkMode } = useThemeDark();

  // Estados locales
  const [selectedProductID, setSelectedProductID] = useState<number | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [productsToEgress, setProductsToEgress] = useState<InventoryMovementWithName[]>([]);

  // Hook para crear movimientos
  const createInventoryMovement = useCreateInventoryMovement();
  const { showToast, message, type } = useToast();

  // Agrega el producto al array local
  const handleAddProduct = () => {
    if (selectedProductID && quantity > 0) {
      const newProduct: InventoryMovementWithName = {
        productID: selectedProductID,
        productName: selectedProductName, // Guardamos el nombre
        quantity,
        date: new Date().toISOString().split("T")[0],
        movementType: "Egreso",
      };

      setProductsToEgress([...productsToEgress, newProduct]);
      // Reseteamos
      setSelectedProductID(null);
      setSelectedProductName("");
      setQuantity(1);
    } else {
      showToast("Por favor, selecciona un producto y cantidad válida.", "error");
    }
  };

  // Elimina el producto del array
  const handleRemoveProduct = (index: number) => {
    setProductsToEgress(productsToEgress.filter((_, i) => i !== index));
  };

  // Envía el formulario
  const handleSubmit = () => {
    if (productsToEgress.length === 0) {
      showToast("Agrega al menos un producto para registrar el egreso.", "error");
      return;
    }

    // Eliminamos la propiedad productName antes de enviar
    const formattedMovements = productsToEgress.map((product) => ({
      productID: product.productID,
      quantity: product.quantity,
      date: new Date().toISOString().split("T")[0],
      movementType: "Egreso",
    }));

    createInventoryMovement.mutate(formattedMovements, {
      onSuccess: () => {
        showToast("Egreso registrado exitosamente.", "success");
        setTimeout(() => {
          onRequestClose();
          setProductsToEgress([]);
        }, 2000);
      },
      onError: (error) => {
        console.error("Error en la solicitud:", error);
        showToast("Hubo un error al registrar el egreso.", "error");
      },
    });
  };

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
            <ProductDropdownByCategory
              selectedProduct={selectedProductID || 0}
              // Recibimos id y name desde el dropdown
              onProductSelect={(id: number, name: string) => {
                setSelectedProductID(id);
                setSelectedProductName(name);
              }}
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
              Agregar producto
            </button>
          </div>

          {/* Tabla de productos a egresar */}
          {productsToEgress.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Productos a egresar:</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 py-1">
                      Producto
                    </th>
                    <th className="border border-gray-300 px-2 py-1">
                      Cantidad
                    </th>
                    <th className="border border-gray-300 px-2 py-1">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsToEgress.map((prod, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-2 py-1">
                        {prod.productName}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {prod.quantity}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="text-white px-2 py-1 rounded-md hover:bg-red-100 transition"
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
              Registrar egreso
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
