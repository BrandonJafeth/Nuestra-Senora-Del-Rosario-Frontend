import { PDFDownloadLink } from '@react-pdf/renderer';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VoucherPaymentPDF from './VoucherPaymentPDF';

import { useThemeDark } from '../../hooks/useThemeDark';

const VoucherPaymentForm: React.FC = () => {
  const { state } = useLocation(); // Obtener el empleado de la navegación
  const { employee } = state || {}; // Desestructurar el estado para obtener los datos del empleado
  const navigate = useNavigate(); // Para navegar a otra página
  const { isDarkMode } = useThemeDark(); 

  const [workedDays, setWorkedDays] = useState(0); // Días trabajados por defecto
  const [grossIncome, setGrossIncome] = useState(0); // Salario bruto
  const [deductions, setDeductions] = useState({
    ccss: 0,
    embargo: 0,
    rentTax: 0,
    alimony: 0,
    otherDeductions: 0,
  });
  
  // Campos adicionales según la imagen
  const [extrasHours, setExtrasHours] = useState(0);
  const [doublesHours, setDoublesHours] = useState(0);
  const [mandatoryHolidays, setMandatoryHolidays] = useState(0);
  const [doubleExtras, setDoubleExtras] = useState(0);
  const [mixedHours, setMixedHours] = useState(0);
  const [nightHours, setNightHours] = useState(0);
  const [adjustments, setAdjustments] = useState(0);
  const [incapacity, setIncapacity] = useState(0);
  const [absence, setAbsence] = useState(0);
  const [vacationDays, setVacationDays] = useState(0);
  const [extraHourRate, setExtraHourRate] = useState(0); // Valor de la hora extra
  const [totalExtraHoursAmount, setTotalExtraHoursAmount] = useState(0); 

  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  if (!employee) {
    return <p>Error: No se encontró el empleado.</p>;
  }

  const [generatePDF, setGeneratePDF] = useState(false);
  // Calcular total de deducciones y neto devengado
  const calculateExtraHoursTotal = () => {
    const totalExtras = extrasHours * extraHourRate;
    setTotalExtraHoursAmount(totalExtras);
    setGrossIncome((prevIncome) => prevIncome + totalExtras); // Sumar horas extras al salario bruto sin reemplazarlo
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateExtraHoursTotal(); // Calcula las horas extras y actualiza el salario bruto
    setGeneratePDF(true);
  };

  const totalDeductions = Object.values(deductions).reduce((acc, val) => acc + val, 0);
  const netIncome = grossIncome + totalExtraHoursAmount - totalDeductions;


  return (
    <div className={`w-full max-w-4xl mx-auto p-6 rounded-[20px] shadow-2xl mt-10 ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <h2 className="text-3xl font-bold mb-6 text-center">Comprobante de Pago</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Información del empleado */}
        <div className="col-span-2">
          <h3 className="text-lg font-bold">Empleado: {employee.firstName} {employee.lastName1}</h3>
          <p>Puesto: {employee.professionName}</p>
          <p>Salario: {employee.typeOfSalaryName}</p> {/* Usar el tipo de salario del empleado */}
        </div>

        {/* Días trabajados */}
        <div>
          <label className="block mb-2">Días trabajados</label>
          <input
            type="number"
            value={workedDays}
            onChange={(e) => setWorkedDays(parseInt(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        {/* Salario Bruto */}
        <div>
          <label className="block mb-2">Salario Bruto</label>
          <input
            type="number"
            value={grossIncome}
            onChange={(e) => setGrossIncome(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        {/* Campos adicionales basados en la imagen */}
        <div>
          <label className="block mb-2">Extras (hrs)</label>
          <input
            type="number"
            value={extrasHours}
            onChange={(e) => setExtrasHours(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        {extrasHours > 0 && (
          <div>
            <label className="block mb-2">Valor por hora extra (₡)</label>
            <input
              type="number"
              value={extraHourRate}
              onChange={(e) => setExtraHourRate(parseFloat(e.target.value))}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
            />
          </div>
        )}
        <div>
          <label className="block mb-2">Dobles (hrs)</label>
          <input
            type="number"
            value={doublesHours}
            onChange={(e) => setDoublesHours(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        <div>
          <label className="block mb-2">Feriados de pago obligatorio (hrs)</label>
          <input
            type="number"
            value={mandatoryHolidays}
            onChange={(e) => setMandatoryHolidays(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        <div>
          <label className="block mb-2">Extras dobles</label>
          <input
            type="number"
            value={doubleExtras}
            onChange={(e) => setDoubleExtras(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        <div>
          <label className="block mb-2">Horas mixtas</label>
          <input
            type="number"
            value={mixedHours}
            onChange={(e) => setMixedHours(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        <div>
          <label className="block mb-2">Horas nocturnas</label>
          <input
            type="number"
            value={nightHours}
            onChange={(e) => setNightHours(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        <div>
          <label className="block mb-2">Ajustes</label>
          <input
            type="number"
            value={adjustments}
            onChange={(e) => setAdjustments(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        <div>
          <label className="block mb-2">Incapacidad</label>
          <input
            type="number"
            value={incapacity}
            onChange={(e) => setIncapacity(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        <div>
          <label className="block mb-2">Ausencia</label>
          <input
            type="number"
            value={absence}
            onChange={(e) => setAbsence(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        <div>
          <label className="block mb-2">Vacaciones disfrutadas (días)</label>
          <input
            type="number"
            value={vacationDays}
            onChange={(e) => setVacationDays(parseFloat(e.target.value))}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        {/* Deducciones */}
        <div className="col-span-2 mt-4">
          <h3 className="text-lg font-bold mb-4">Deducciones</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">CCSS</label>
              <input
                type="number"
                value={deductions.ccss}
                onChange={(e) => setDeductions({ ...deductions, ccss: parseFloat(e.target.value) })}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
              />
            </div>

            <div>
              <label className="block mb-2">Embargo</label>
              <input
                type="number"
                value={deductions.embargo}
                onChange={(e) => setDeductions({ ...deductions, embargo: parseFloat(e.target.value) })}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}  />
            </div>

            <div>
              <label className="block mb-2">Impuesto de Renta</label>
              <input
                type="number"
                value={deductions.rentTax}
                onChange={(e) => setDeductions({ ...deductions, rentTax: parseFloat(e.target.value) })}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
              />
            </div>

            <div>
              <label className="block mb-2">Pensión Alimenticia</label>
              <input
                type="number"
                value={deductions.alimony}
                onChange={(e) => setDeductions({ ...deductions, alimony: parseFloat(e.target.value) })}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-2">Otras deducciones</label>
              <input
                type="number"
                value={deductions.otherDeductions}
                onChange={(e) => setDeductions({ ...deductions, otherDeductions: parseFloat(e.target.value) })}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
              />
            </div>
          </div>
        </div>

        {/* Total devengado neto */}
        <div className="col-span-2">
          <h3 className="text-lg font-bold mt-6">Total Devengado Neto: ₡{netIncome.toLocaleString()}</h3>
        </div>

        {/* Fecha de Pago */}
        <div>
          <label className="block mb-2">Fecha de Pago</label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          />
        </div>

        {/* Botón de Enviar */}
        <div className="flex justify-center space-x-4 mt-8">
        <button
        onClick={() => navigate('/dashboard/personal/lista')}
          type="button"
          className="px-7 py-4 bg-red-500 text-white text-lg font-inter rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
          tabIndex={1}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-7 py-4 bg-blue-500 text-white text-lg font-inter rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
          tabIndex={0}
        >
          Agregar
        </button>
      </div>
      </form>
      {generatePDF && (
        <PDFDownloadLink
          document={
            <VoucherPaymentPDF
              employee={employee}
              workedDays={workedDays}
              grossIncome={grossIncome}
              extrasHours={extrasHours}
               totalExtraHoursAmount={totalExtraHoursAmount} 
               extraHourRate={extraHourRate}
              doublesHours={doublesHours}
              mandatoryHolidays={mandatoryHolidays}
              doubleExtras={doubleExtras}
              mixedHours={mixedHours}
              nightHours={nightHours}
              adjustments={adjustments}
              incapacity={incapacity}
              absence={absence}
              vacationDays={vacationDays}
              deductions={deductions}
              netIncome={netIncome}
              paymentDate={paymentDate}
            />
          }
          fileName={`ComprobantePago_${employee.firstName}_${employee.lastName1}.pdf`}
        >
          {({ loading }) =>
            {
              return loading ? (
                <p className="text-center mt-4 text-gray-500">Generando PDF...</p>
              ) : (
                <button
                className="px-7 py-4 bg-green-500 text-white text-lg font-inter rounded-lg shadow-lg hover:bg-green-600 transition duration-200 mt-4">
                  Descargar Comprobante PDF
                </button>
              );
            }
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default VoucherPaymentForm;
