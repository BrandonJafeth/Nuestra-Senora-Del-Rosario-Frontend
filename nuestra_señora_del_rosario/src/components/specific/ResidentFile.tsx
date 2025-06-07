import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileAlt,
  FaArrowLeft,
} from 'react-icons/fa';
import { useResidentDocuments } from '../../hooks/useResidentFile';
import { useThemeDark } from '../../hooks/useThemeDark';
import RenameDocumentModal from '../microcomponents/RenameDocumentModal';
import { useDeleteFile } from '../../hooks/useFileDelete';
import ConfirmationModal from '../microcomponents/ConfirmationModal';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';

/* ───────────────────────── helpers ────────────────────────── */
const getFileIcon = (fileName: string, dark: boolean) => {
  const base = 'text-xl mr-2';
  const pdf  = dark ? 'text-red-400'   : 'text-red-500';
  const doc  = dark ? 'text-blue-400'  : 'text-blue-500';
  const img  = dark ? 'text-green-400' : 'text-green-500';
  const def  = dark ? 'text-gray-400'  : 'text-gray-500';

  if (fileName.endsWith('.pdf'))                       return <FaFilePdf  className={`${pdf} ${base}`} />;
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return <FaFileWord className={`${doc} ${base}`} />;
  if (fileName.match(/\.(jpg|jpeg|png|gif)$/))         return <FaFileImage className={`${img} ${base}`} />;
  return <FaFileAlt className={`${def} ${base}`} />;
};

const ResidentDocumentsPage: React.FC = () => {
  /* ───── hooks ───── */
  const location = useLocation();
  const residentsName =
    location.state?.residentName || 'Residente Desconocido';
  const { residentName } = useParams<{ residentName: string }>();
  const decodedResidentName = decodeURIComponent(residentName || '');
  const { data: documents, isLoading, isError } =
    useResidentDocuments(decodedResidentName);
  const { isDarkMode } = useThemeDark();
  const { message, showToast, type } = useToast();
  const { mutate: deleteFile } = useDeleteFile(decodedResidentName);

  /* ───── local state ───── */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  /* ───── handlers ───── */
  const navigateBack = () => window.history.back();

  const openModal = (doc: { id: string; name: string }) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const openDeleteModal = (doc: { id: string; name: string }) => {
    setSelectedDocument(doc);
    setDeleteModalOpen(true);
  };

  const closeModal       = () => { setSelectedDocument(null); setIsModalOpen(false); };
  const closeDeleteModal = () => { setSelectedDocument(null); setDeleteModalOpen(false); };

  const handleDelete = () => {
    if (selectedDocument) {
      deleteFile(selectedDocument.id);
      showToast('Se ha eliminado el archivo exitosamente', 'success');
      setDeleteModalOpen(false);
    }
  };

  /* ───── estados de carga ───── */
  if (isLoading) return <div className="p-6">Cargando documentos…</div>;
  if (isError)   return <div className="p-6 text-red-600">Error al cargar documentos.</div>;

  /* ───── estilos condicionales ───── */
  const containerCls = `
    w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl
    ${isDarkMode ? 'bg-[#0D313F] text-gray-100' : 'bg-white text-gray-800'}
  `;

  const thCls = `
    px-6 py-3 font-semibold
    ${isDarkMode ? 'bg-[#134557] text-gray-100' : 'bg-gray-200 text-gray-700'}
  `;

  const rowHover = isDarkMode
    ? 'hover:bg-[#173d4c]'
    : 'hover:bg-gray-50';

  const linkCls = `
    ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-500 hover:text-blue-700'}
    underline
  `;

  const btnBase = 'px-4 py-2 rounded-lg shadow-md transition duration-200';
  const btnEdit = isDarkMode
    ? 'bg-orange-500 hover:bg-orange-400 text-white'
    : 'bg-orange-500 hover:bg-orange-600 text-white';
  const btnDel  = isDarkMode
    ? 'bg-red-600 hover:bg-red-500 text-white'
    : 'bg-red-500 hover:bg-red-600 text-white';

  /* ───── JSX ───── */
  return (
    <div className={containerCls}>
      {/* título y botón regresar */}
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
        <h2 className="w-full text-center text-3xl font-bold">{`Documentos de ${residentsName}`}</h2>
      </div>

      {/* tabla */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className={thCls}>Nombre del Documento</th>
              <th className={thCls}>Ver</th>
              <th className={thCls}>Descargar</th>
              <th className={thCls}>Acciones</th>
            </tr>
          </thead>

          <tbody className={isDarkMode ? 'bg-[#0d2a37]' : 'bg-white'}>
            {documents?.map((doc) => (
              <tr key={doc.id} className={`border-b ${rowHover}`}>
                {/* nombre + icono */}
                <td className="px-6 py-3 flex items-center text-center">
                  {getFileIcon(doc.name, isDarkMode)}
                  {doc.name}
                </td>

                {/* ver */}
                <td className="text-center px-6 py-3">
                  <a
                    href={doc.webViewLink}
                    target="_blank"
                    rel="noreferrer"
                    className={linkCls}
                  >
                    Ver
                  </a>
                </td>

                {/* descargar */}
                <td className="px-6 py-3 text-center">
                  <a
                    href={doc.webContentLink}
                    download
                    className={linkCls}
                  >
                    Descargar
                  </a>
                </td>

                {/* acciones */}
                <td className="px-6 py-3 space-x-2 items-center flex justify-center">
                  <button
                    onClick={() => openModal(doc)}
                    className={`${btnBase} ${btnEdit}`}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(doc)}
                    className={`${btnBase} ${btnDel}`}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modales */}
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

      {/* toast */}
      <Toast message={message} type={type} />
    </div>
  );
};

export default ResidentDocumentsPage;
