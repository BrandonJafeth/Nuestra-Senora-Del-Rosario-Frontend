import React, { useState } from "react";
import { useUploadImage } from "../../hooks/useUploadImage";

const UploadGallery = ({ refetchGallery, selectedCategory }: { refetchGallery: () => void; selectedCategory: number | null }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadMutation = useUploadImage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Manejar el evento de drag & drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Mostrar vista previa de la imagen
    }
  };

  // Manejar selección de archivo desde el input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Mostrar vista previa de la imagen
    }
  };

  // Subir imagen cuando el usuario haga clic en "Subir Imagen"
  const handleUpload = async () => {
    if (selectedFile && selectedCategory) {
      await uploadMutation.mutateAsync({ file: selectedFile, category: selectedCategory });
      refetchGallery(); // 🔄 Actualizar la galería después de subir la imagen
      setSelectedFile(null);
      setPreviewUrl(null); // Limpiar vista previa después de subir
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4 text-center">Subir Imagen a la Galería</h2>

      {/* Drag & Drop Area */}
      <div
        className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer rounded-md flex justify-center items-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{ height: "180px", width: "100%", maxWidth: "400px", margin: "0 auto" }} // 🔥 Limita el área
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Vista previa"
            className="max-h-full max-w-full object-contain rounded-md shadow-md" // 🔥 La imagen se ajusta sin deformarse
            style={{ height: "100%", width: "100%", objectFit: "contain" }}
          />
        ) : (
          <p className="text-gray-600">Arrastra y suelta una imagen aquí o selecciona una</p>
        )}
      </div>

      {/* Input para seleccionar archivos */}
      <div className="mt-4 flex justify-center">
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileUpload" />
        <label
          htmlFor="fileUpload"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300 transition"
        >
          Seleccionar Imagen
        </label>
      </div>

      {/* Botón de subir con tamaño más adecuado */}
      <div className="mt-4 flex justify-center">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
          onClick={handleUpload}
          disabled={!selectedFile || !selectedCategory}
          style={{ cursor: selectedFile && selectedCategory ? "pointer" : "not-allowed" }}
        >
          {uploadMutation.isLoading ? "Subiendo..." : "Subir Imagen"}
        </button>
      </div>

      {/* Mensajes de estado */}
      {uploadMutation.isError && <p className="text-red-600 text-center mt-2">Error al subir la imagen</p>}
      {uploadMutation.isSuccess && <p className="text-green-600 text-center mt-2">Imagen subida correctamente</p>}
    </div>
  );
};

export default UploadGallery;
