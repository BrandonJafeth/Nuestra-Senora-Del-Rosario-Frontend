import React from 'react';
import { useParams } from 'react-router-dom';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import { useResidentDocuments } from '../../hooks/useResidentFile';
import { useThemeDark } from '../../hooks/useThemeDark';

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith('.pdf')) return <FaFilePdf className="text-red-500 text-xl mr-2" />;
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return <FaFileWord className="text-blue-500 text-xl mr-2" />;
  if (fileName.match(/\.(jpg|jpeg|png|gif)$/)) return <FaFileImage className="text-green-500 text-xl mr-2" />;
  return <FaFileAlt className="text-gray-500 text-xl mr-2" />;
};

const ResidentDocumentsPage: React.FC = () => {
  const { residentName } = useParams<{ residentName: string }>();
  const decodedResidentName = decodeURIComponent(residentName || '');
  const { data: documents, isLoading, isError } = useResidentDocuments(decodedResidentName);
  const { isDarkMode } = useThemeDark();
  const navigateBack = () => window.history.back();

  if (isLoading) return <div>Cargando documentos...</div>;
  if (isError) return <div>Error al cargar documentos.</div>;

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
              <div className="flex justify-between items-center mb-6">
        <button
          onClick={navigateBack}
          className="flex justify-start items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          <FaArrowLeft size={20} />
          <span className="text-lg font-semibold">Regresar</span>
        </button>
        <h2 className={`flex justify-end mx-8 my-3 text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Documentos de {decodedResidentName}
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
                  <a
                    href={doc.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver
                  </a>
                </td>
                <td className="px-6 py-3">
                  <a
                    href={doc.webContentLink}
                    target="_blank"
                    download
                    className="text-blue-500 hover:underline"
                  >
                    Descargar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResidentDocumentsPage;
