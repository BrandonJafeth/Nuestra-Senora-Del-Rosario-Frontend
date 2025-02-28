import React, { useState } from "react";
import { useTypeSalary } from "../../hooks/useTypeSalary";
import { useManagmentTypeSalary } from "../../hooks/useManagmentTypeSalary";
import AdminTable from "../microcomponents/AdminTable";
import AdminModalAdd from "../microcomponents/AdminModalAdd";
import Toast from "../common/Toast";

const TableTypeOfSalary: React.FC = () => {
  const { createTypeSalary, updateTypeSalary, deleteTypeSalary, toast } = useManagmentTypeSalary();
  const { data: typeSalary, isLoading } = useTypeSalary();
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 3; // 📌 Esto debe calcularse dinámicamente según la API

  // 📌 Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSalaryType, setNewSalaryType] = useState("");

  // 📌 Función para abrir el modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 📌 Función para agregar un nuevo tipo de salario
  const handleAddTypeSalary = () => {
    if (newSalaryType.trim() === "") return;
    createTypeSalary.mutate({
      name_TypeOfSalary: newSalaryType,
      id_TypeOfSalary: 0
    });
    setNewSalaryType("");
    closeModal();
  };

  const handleCloseModal = () => {
    setNewSalaryType("");
    closeModal();
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Tipos de Salario</h2>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdminTable
        title="Lista de Tipos de Salario"
        columns={[
          { key: "name_TypeOfSalary", label: "Nombre" },
        ]}
        data={typeSalary || []}
        isLoading={isLoading}
        onAdd={openModal}
        onEdit={(item) => updateTypeSalary.mutate({ id: item.id_TypeOfSalary, data: { name_TypeOfSalary: "Editado" } })}
        onDelete={(id) => deleteTypeSalary.mutate(id)}
        isDarkMode={false} // Puedes conectar con tu `useThemeDark`
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={() => setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev))}
        onPreviousPage={() => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev))}
      />

      {/* 📌 Modal para Agregar un Nuevo Tipo de Salario */}
      <AdminModalAdd isOpen={isModalOpen} title="Agregar Nuevo Tipo de Salario" onClose={closeModal}>
        <input
          type="text"
          value={newSalaryType}
          onChange={(e) => setNewSalaryType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Ingrese el nombre del tipo de salario"
        />
        <div className="flex justify-center space-x-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 " onClick={handleCloseModal}>
          Cancelar
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleAddTypeSalary}>
          Guardar
        </button>
        </div>
      </AdminModalAdd>
    </div>
  );
};

export default TableTypeOfSalary;
