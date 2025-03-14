import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMedicalHistoryById } from "../../hooks/useMedicalHistoryById";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { FaNotesMedical, FaPlus, FaEdit, FaArrowLeft } from "react-icons/fa";

const MedicalHistory: React.FC = () => {
  const { residentId } = useParams();
  const resident_Id = Number(residentId);
  const navigate = useNavigate();

  const { data: medicalHistory, isLoading, error } = useMedicalHistoryById(resident_Id);

  // Estado para el año seleccionado y la paginación
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 1;

  // Filtrar registros por año (asumiendo que creationDate está en formato ISO)
  const filteredHistories = useMemo(() => {
    if (!medicalHistory || !Array.isArray(medicalHistory)) return [];
    return medicalHistory.filter(record => {
      const recordYear = new Date(record.creationDate).getFullYear();
      return recordYear === selectedYear;
    });
  }, [medicalHistory, selectedYear]);

  // Calcular años disponibles a partir de los datos
  const availableYears = useMemo(() => {
    if (!medicalHistory || !Array.isArray(medicalHistory)) return [];
    const yearsSet = new Set<number>();
    medicalHistory.forEach(record => {
      yearsSet.add(new Date(record.creationDate).getFullYear());
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [medicalHistory]);

  // Paginación
  const totalPages = Math.ceil(filteredHistories.length / pageSize);
  const paginatedHistories = filteredHistories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    setCurrentPage(1); // Reiniciar a la página 1 al cambiar el año
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error al cargar el historial médico.</p>;

  return (
    <div className="p-6 rounded-xl shadow-xl w-full max-w-3xl mx-auto bg-white text-gray-900 relative">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaNotesMedical className="text-red-500" size={24} />
        Historial Médico
      </h2>

      {/* Selector de Año */}
      <div className="mb-4 flex justify-center">
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="p-2 border rounded"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Historial Médico filtrado */}
      {paginatedHistories.length ? (
        <div className="space-y-4">
          {paginatedHistories.map((record: any) => {
            const recordUpdatedAt = record.editDate ? new Date(record.editDate).toLocaleDateString() : null;
            const recordCreatedAt = new Date(record.creationDate).toLocaleDateString();

            return (
              <div key={record.id_MedicalHistory} className="p-4 border rounded-lg shadow-md bg-gray-100 relative">
                <p className="text-sm text-gray-600">
                  <strong>Fecha de registro:</strong> {recordCreatedAt}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Última actualización:</strong> {recordUpdatedAt ?? "No editado"}
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  <strong>Diagnóstico:</strong> {record.diagnosis}
                </p>
                <p className="text-gray-700"><strong>Tratamiento:</strong> {record.treatment}</p>
                <p className="text-gray-700"><strong>Observaciones:</strong> {record.observations}</p>
                {record.notes && (
                  <p className="italic text-gray-600 mt-2">
                    <strong>Notas:</strong> {record.notes}
                  </p>
                )}
                <button
                  className="absolute top-2 right-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
                  onClick={() => navigate(`/dashboard/residente/${resident_Id}/editar-historial/${record.id_MedicalHistory}`)}
                >
                  <FaEdit size={16} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No hay historial médico registrado para el año {selectedYear}.</p>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaArrowLeft />
          </button>
          <span>{` ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
           <FaArrowLeft className="transform rotate-180" />

          </button>
        </div>
      )}

      {/* Botón para agregar nuevo historial */}
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
