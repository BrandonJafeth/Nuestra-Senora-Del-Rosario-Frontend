import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import { useResidentDocuments } from '../../hooks/useResidentFile';
import { useThemeDark } from '../../hooks/useThemeDark';
import RenameDocumentModal from '../microcomponents/RenameDocumentModal';
import { useDeleteFile } from '../../hooks/useFileDelete';
import ConfirmationModal from '../microcomponents/ConfirmationModal';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith('.pdf')) return <FaFilePdf className="text-red-500 text-xl mr-2" />;
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return <FaFileWord className="text-blue-500 text-xl mr-2" />;
  if (fileName.match(/\.(jpg|jpeg|png|gif)$/)) return <FaFileImage className="text-green-500 text-xl mr-2" />;
  return <FaFileAlt className="text-gray-500 text-xl mr-2" />;
};

const ResidentDocumentsPage: React.FC = () => {
  const location = useLocation();
  const residentsName = location.state?.residentName || "Residente Desconocido";
  const { residentName } = useParams<{ residentName: string }>();
  const decodedResidentName = decodeURIComponent(residentName || '');
  const { data: documents, isLoading, isError } = useResidentDocuments(decodedResidentName);
  const { isDarkMode } = useThemeDark();
  const navigateBack = () => window.history.back();
  const {message, showToast, type} = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{id: string, name: string} | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const { mutate: deleteFile } = useDeleteFile(decodedResidentName);

  const openModal = (doc: { id: string; name: string }) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const openDeleteModal = (doc: { id: string; name: string }) => {
    setSelectedDocument(doc);
    setDeleteModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setSelectedDocument(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedDocument) {
      deleteFile(selectedDocument.id);
      showToast("Se ha eliminado el archivo exitosamente", "success")
      setDeleteModalOpen(false);
    } 
      
  };

  if (isLoading) return <div>Cargando documentos...</div>;
  if (isError) return <div>Error al cargar documentos.</div>;

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
    <div className="flex items-center relative mb-6">
      <div className="absolute left-0">
        <button
          onClick={navigateBack}
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          <FaArrowLeft size={20} />
          <span className="text-lg font-semibold">Regresar</span>
        </button>
      </div>
      <h2 className={`w-full text-center text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Documentos de {residentsName}
      </h2>
    </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-6 py-3">Nombre del Documento</th>
              <th className="px-6 py-3">Tamaño</th>
              <th className="px-6 py-3">Ver</th>
              <th className="px-6 py-3">Descargar</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {documents && documents.map((doc) => (
              <tr key={doc.id} className="border-b hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-3 flex items-center">
                  {getFileIcon(doc.name)}
                  {doc.name}
                </td>
                <td className="px-6 py-3">{(doc.size / (1024 * 1024)).toFixed(2)} MB</td>
                <td className="px-6 py-3">
                  <a href={doc.webViewLink} target="_blank" className="text-blue-500 hover:underline">Ver</a>
                </td>
                <td className="px-6 py-3">
                  <a href={doc.webContentLink} download className="text-blue-500 hover:underline">Descargar</a>
                </td>
                <td className="px-6 py-3 space-x-2">
                  <button
                    onClick={() => openModal(doc)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                  onClick={() => openDeleteModal(doc)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                >
                  Eliminar
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDocument && (
        <RenameDocumentModal
          isOpen={isModalOpen}
          document={selectedDocument}
          onClose={closeModal}
        />
      )}

{selectedDocument && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          title="Confirmar eliminación"
          message={`¿Está seguro que desea eliminar el documento "${selectedDocument.name}"?`}
          confirmText="Eliminar"
          isLoading={false}
        />
      )}
      <Toast message={message} type={type}/>
    </div>
  );
};

export default ResidentDocumentsPage;
