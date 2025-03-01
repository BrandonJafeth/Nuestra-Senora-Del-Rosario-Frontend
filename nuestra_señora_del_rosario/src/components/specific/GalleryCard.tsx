import { useState, useEffect } from "react";
import { useGallery } from "../../hooks/useGallery";
import UploadGallery from "../microcomponents/UploadGallery";
import { useDeleteImage } from "../../hooks/useDeleteImage";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import { useGalleryCategories } from "../../hooks/useGalleryCategory";

const Gallery = () => {
  const { data: gallery, isLoading, isError, refetch } = useGallery(); // 🔄 Agregamos `refetch` para actualizar la galería
  const { data: categories, isLoading: isLoadingCategories } = useGalleryCategories();
  const deleteMutation = useDeleteImage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  // Establecer la primera categoría como seleccionada por defecto
  useEffect(() => {
    if (categories && categories.length > 0) {
      setSelectedCategory(categories[0].id_GalleryCategory);
    }
  }, [categories]);

  if (isLoading || isLoadingCategories)
    return <p className="text-center text-gray-700">Cargando imágenes...</p>;

  if (isError) return <p className="text-center text-red-600">Error al cargar la galería.</p>;

  if (!categories || categories.length === 0)
    return <p className="text-center text-gray-500">No hay categorías disponibles.</p>;

  // Filtrar imágenes por categoría seleccionada
  const filteredGallery = gallery?.filter((item) => item.id_GalleryCategory === selectedCategory) || [];

  // Mostrar el modal antes de eliminar una imagen
  const handleOpenModal = (id_GalleryItem: number) => {
    setImageToDelete(id_GalleryItem);
    setIsModalOpen(true);
  };

  // Confirmar eliminación de la imagen
  const handleConfirmDelete = async () => {
    if (imageToDelete !== null) {
      await deleteMutation.mutateAsync(imageToDelete);
      setIsModalOpen(false);
      refetch(); // 🔄 Refrescar la galería después de eliminar la imagen
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Galería</h1>

      {/* Dropdown para seleccionar categoría */}
      <div className="flex justify-center mb-6">
        <select
          className="p-2 border rounded-lg shadow-md"
          value={selectedCategory ?? ""}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
        >
          {categories.map((category) => (
            <option key={category.id_GalleryCategory} value={category.id_GalleryCategory}>
              {category.name_Gallery_Category}
            </option>
          ))}
        </select>
      </div>

      {/* Componente para subir imágenes */}
      <UploadGallery refetchGallery={refetch} selectedCategory={selectedCategory} />

      {/* Mostrar imágenes filtradas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {filteredGallery.length > 0 ? (
          filteredGallery.map((item) => (
            <div key={item.id_GalleryItem} className="border rounded-lg overflow-hidden shadow-lg relative">
              <img
                src={item.gallery_Image_Url}
                alt={`Imagen ${item.id_GalleryItem}`}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => handleOpenModal(item.id_GalleryItem)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700 transition"
              >
                ✖
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No hay imágenes en esta categoría.
          </p>
        )}
      </div>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isLoading={deleteMutation.isLoading}
      />
    </div>
  );
};

export default Gallery;
