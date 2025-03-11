// FILE: components/CategoryDropdown.tsx
import React, { useEffect, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../hooks/useAuth';
import { Category } from '../../types/CategoryType';

interface CategoryDropdownProps {
  onCategorySelect: (categoryId: number) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ onCategorySelect }) => {
  const { data: categories, isLoading, isError } = useCategories();
  const { selectedRole } = useAuth();

  // Definición de roles y las categorías permitidas
  const allowedCategoriesByRole: { [key: string]: number[] } = {
    Admin: [1, 2, 3, 4],
    Enfermeria: [4],
    Fisioterapia: [4],
    // Si hay otros roles, agrégalos
  };

  // Si existe un mapping para el rol, se usan esas categorías; sino, se muestran todas.
  const allowedCategoryIds =
    selectedRole && allowedCategoriesByRole[selectedRole]
      ? allowedCategoriesByRole[selectedRole]
      : categories
      ? categories.map((cat) => cat.categoryID)
      : [];

  const filteredCategories: Category[] = categories
    ? categories.filter((cat) => allowedCategoryIds.includes(cat.categoryID))
    : [];

  // Estado local para controlar la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  // Cuando se carguen las categorías permitidas, selecciona la primera si aún no hay seleccionada
  useEffect(() => {
    if (filteredCategories.length > 0 && selectedCategory === "") {
      const defaultCategory = filteredCategories[0].categoryID;
      setSelectedCategory(defaultCategory);
      onCategorySelect(defaultCategory);
    }
  }, [filteredCategories, selectedCategory, onCategorySelect]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = Number(event.target.value);
    setSelectedCategory(selectedCategoryId);
    onCategorySelect(selectedCategoryId);
  };

  if (isLoading) return <p>Cargando categorías...</p>;
  if (isError) return <p>Error al cargar las categorías.</p>;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {/* Etiqueta opcional: se puede ocultar en móviles si quieres */}
      <label
        htmlFor="category-select"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block"
      >
        Categoría:
      </label>

      <select
        id="category-select"
        onChange={handleChange}
        value={selectedCategory}
        className="
          p-2 border rounded w-full sm:w-auto 
          max-w-xs 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:bg-gray-700 dark:text-white dark:border-gray-600
        "
      >
        <option value="">Seleccione una categoría</option>
        {filteredCategories.map((category) => (
          <option key={category.categoryID} value={category.categoryID}>
            {category.categoryName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
