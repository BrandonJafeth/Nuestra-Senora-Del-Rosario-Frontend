// FILE: components/CategoryDropdown.tsx
import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../hooks/useAuth';
import { Category } from '../../types/CategoryType';

interface CategoryDropdownProps {
  selectedCategory: number; // Valor controlado desde el padre
  onCategorySelect: (categoryId: number) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, onCategorySelect }) => {
  const { data: categories, isLoading, isError } = useCategories();
  const { selectedRole } = useAuth();

  // Roles y categorías permitidas
  const allowedCategoriesByRole: { [key: string]: number[] } = {
    Admin: [1, 2, 3, 4],
    Enfermeria: [4],
    Fisioterapia: [4],
  };

  const allowedCategoryIds =
    selectedRole && allowedCategoriesByRole[selectedRole]
      ? allowedCategoriesByRole[selectedRole]
      : categories
      ? categories.map((cat) => cat.categoryID)
      : [];

  const filteredCategories: Category[] = categories
    ? categories.filter((cat) => allowedCategoryIds.includes(cat.categoryID))
    : [];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = Number(event.target.value);
    onCategorySelect(selectedCategoryId);
  };

  if (isLoading) return <p>Cargando categorías...</p>;
  if (isError) return <p>Error al cargar las categorías.</p>;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
          p-2 border rounded w-32 sm:w-48 
          max-w-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:bg-gray-700 dark:text-white dark:border-gray-600
        "
      >
        <option value={0}>Seleccione una categoría</option>
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
