import React, { useState } from "react";
import { useUploadImage } from "../../hooks/useUploadImage";


const UploadGallery = ({ refetchGallery, selectedCategory }: { refetchGallery: () => void; selectedCategory: number | null }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadMutation = useUploadImage();

  // Manejar el evento de drag & drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  // Subir imagen cuando el usuario haga clic en "Subir Imagen"
  const handleUpload = async () => {
    if (selectedFile && selectedCategory) {
      await uploadMutation.mutateAsync({ file: selectedFile, category: selectedCategory });
      refetchGallery(); // 🔄 Actualizar la galería después de subir la imagen
      setSelectedFile(null); // Limpiar el estado después de subir la imagen
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Subir Imagen a la Galería</h2>

      {/* Drag & Drop */}
      <div
        className="border-2 border-dashed border-gray-400 p-10 text-center cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <p className="text-green-600 font-semibold">{selectedFile.name}</p>
        ) : (
          <p className="text-gray-600">Arrastra y suelta una imagen aquí</p>
        )}
      </div>

      {/* Botón de subir */}
      <button
        className="mt-4 bg-blue-500 text-white p-2 rounded-lg disabled:opacity-50 w-full"
        onClick={handleUpload}
        disabled={!selectedFile || !selectedCategory}
      >
        {uploadMutation.isLoading ? "Subiendo..." : "Subir Imagen"}
      </button>

      {/* Mensajes de estado */}
      {uploadMutation.isError && <p className="text-red-600">Error al subir la imagen</p>}
      {uploadMutation.isSuccess && <p className="text-green-600">Imagen subida correctamente</p>}
    </div>
  );
};

export default UploadGallery;
