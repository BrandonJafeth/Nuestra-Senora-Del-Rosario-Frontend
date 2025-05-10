import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMedicalHistoryById } from "../../hooks/useMedicalHistoryById";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { FaNotesMedical, FaPlus, FaEdit, FaArrowLeft } from "react-icons/fa";
import { useThemeDark } from "../../hooks/useThemeDark";

const MedicalHistory: React.FC = () => {
  const { residentId } = useParams();
  const resident_Id = Number(residentId);
  const navigate = useNavigate();

  const { data: medicalHistory, isLoading, error } = useMedicalHistoryById(resident_Id);
  const { isDarkMode } = useThemeDark();

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 1;

  const filteredHistories = useMemo(() => {
    if (!medicalHistory || !Array.isArray(medicalHistory)) return [];
    return medicalHistory.filter(record => new Date(record.creationDate).getFullYear() === selectedYear);
  }, [medicalHistory, selectedYear]);

  const availableYears = useMemo(() => {
    if (!medicalHistory || !Array.isArray(medicalHistory)) return [];
    const yearsSet = new Set(medicalHistory.map(record => new Date(record.creationDate).getFullYear()));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [medicalHistory]);

  const totalPages = Math.ceil(filteredHistories.length / pageSize);
  const paginatedHistories = filteredHistories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar el historial médico.</p>;

  return (
    <div className={`p-6 rounded-xl shadow-xl w-full max-w-3xl mx-auto relative ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-4 left-4 p-2 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
        aria-label="Volver"
      >
        <FaArrowLeft />
      </button>
      
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaNotesMedical className="text-red-500" size={24} />
        Historial Médico
      </h2>

      <div className="mb-4 flex justify-center">
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className={`p-2 border rounded ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {paginatedHistories.length ? (
        <div className="space-y-4">
          {paginatedHistories.map((record: any) => (
            <div key={record.id_MedicalHistory} className={`p-4 border rounded-lg shadow-md relative ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100"}`}>
              <p className="text-sm"><strong>Fecha de registro:</strong> {new Date(record.creationDate).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Última actualización:</strong> {record.editDate ? new Date(record.editDate).toLocaleDateString() : "No editado"}</p>
              <p className="text-lg font-semibold"><strong>Diagnóstico:</strong> {record.diagnosis}</p>
              <p><strong>Tratamiento:</strong> {record.treatment}</p>
              <p><strong>Observaciones:</strong> {record.observations}</p>
              {record.notes && <p className="italic mt-2"><strong>Notas:</strong> {record.notes}</p>}
              <button
                className="absolute top-2 right-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
                onClick={() => navigate(`/dashboard/residente/${resident_Id}/editar-historial/${record.id_MedicalHistory}`)}
              >
                <FaEdit size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No hay historial médico registrado para el año {selectedYear}.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300">
            <FaArrowLeft />
          </button>
          <span>{`${currentPage} de ${totalPages}`}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300">
            <FaArrowLeft className="transform rotate-180" />
          </button>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate(`/dashboard/residente/${resident_Id}/agregar-historial`)}
        >
          <FaPlus className="mr-2" size={16} />
          Agregar nuevo historial
        </button>
      </div>
    </div>
  );
};

export default MedicalHistory;