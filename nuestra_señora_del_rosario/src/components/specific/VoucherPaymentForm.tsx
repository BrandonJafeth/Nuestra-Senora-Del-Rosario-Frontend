  import React, { useState } from 'react';
  import { PaymentReceiptType } from '../../types/PaymentReceiptType';
  import { useCreatePaymentReceipt } from '../../hooks/useCreatePaymentReceipt';
  import SendPaymentReceiptForm from '../microcomponents/SendPaymentReceiptForm';
  import { useLocation } from 'react-router-dom';
  import { useThemeDark } from '../../hooks/useThemeDark'; // Hook para manejar el modo oscuro
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoadingSpinner from '../microcomponents/LoadingSpinner';

  const PaymentReceiptForm: React.FC = () => {
    const { showToast,  message,
      type, } = useToast();
    const location = useLocation(); 
    const { state } = location; 
    const id_EmployeeFromState = state?.id_Employee  || 0; 
    const employeeDniFromState = state?.employeeDni  || 0; 
    const employeeNameFromState = state?.name  || 'Desconocido'; 
    const employeelastnameFromState = state?.lastName || 'Desconocido';
    const { isDarkMode } = useThemeDark(); 
  
    const [formData, setFormData] = useState<PaymentReceiptType>({
      id: 0,
      id_Employee: id_EmployeeFromState,
      employeeDni: employeeDniFromState,
      paymentDate: new Date().toISOString().split('T')[0],
      salary: 0,
      overtime: 0,
      workedDays: 0,
      grossIncome: 0,
      totalExtraHoursAmount: 0,
      extraHourRate: 0,
      doubleExtras: 0,
      nightHours: 0,
      adjustments: 0,
      incapacity: 0,
      absence: 0,
      vacationDays: 0,
      deductionsList: [{ type: '', amount: 0 }], // Deducciones por defecto
      totalDeductions: 0,
      notes: '',
    });
  
    const [generatedReceiptId, setGeneratedReceiptId] = useState<number | null>(null); // Estado para almacenar el ID del comprobante generado
    const { mutate: createPaymentReceipt, isLoading } = useCreatePaymentReceipt();
    const [downloadLoading, setDownloadLoading] = useState(false);

    const handleDownloadPDF = async () => {
      if (!generatedReceiptId) return;
  
      const token = Cookies.get("authToken");
      if (!token) {
        showToast("No se encontró un token de autenticación", "error");
        return;
      }
  
      try {
        setDownloadLoading(true);
        // Solicitud con Axios para obtener el PDF en formato blob
        const response = await axios.get(
          `https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api/PaymentReceipt/DownloadPaymentReceiptPdf/${generatedReceiptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
  
        // Crear un Blob con la data del PDF
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        // Generar un URL temporal
        const url = URL.createObjectURL(pdfBlob);
        // Crear un enlace <a> y simular clic para descargar
        const link = document.createElement("a");
        link.href = url;
        link.download = "comprobante.pdf";
        link.click();
        // Revocar el URL después de 1 segundo
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        console.error("Error al descargar PDF:", error);
        showToast("Error al descargar el PDF.", "error");
      } finally {
        setDownloadLoading(false);
      }
    };
  
  
    // Manejar cambios en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    // Manejar cambios en las deducciones
    const handleDeductionsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const updatedDeductions = formData.deductionsList.map((deduction, i) =>
        i === index ? { ...deduction, [name]: value } : deduction
      );
      setFormData({ ...formData, deductionsList: updatedDeductions });
    };
  
    // Agregar una deducción
    const addDeduction = () => {
      setFormData({
        ...formData,
        deductionsList: [...formData.deductionsList, { type: '', amount: 0 }],
      });
    };
  
    // Eliminar una deducción
    const removeDeduction = (index: number) => {
      const updatedDeductions = formData.deductionsList.filter((_, i) => i !== index);
      setFormData({ ...formData, deductionsList: updatedDeductions });
    };
  
    // Enviar el formulario
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createPaymentReceipt(formData, {
        onSuccess: (data) => {
          setGeneratedReceiptId(data.data.id);
          showToast('Comprobante generado correctamente.', 'success'); // Mostrar notificación de éxito
        },
        onError: () => {
          showToast('Error al generar el comprobante.', 'error'); // Mostrar notificación de error
        },
      });
    };
  
    return (
      <div
        className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${
          isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'
        }`}
      >
        <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Generar Comprobante de Pago  - <span>{employeeNameFromState} {employeelastnameFromState}</span>
        </h2>
  
        {/* Formulario */}
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Columna izquierda */}
          <div className="space-y-6">
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Fecha de Pago</label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
                required
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Salario</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
                required
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Horas Extra</label>
              <input
                type="number"
                name="overtime"
                value={formData.overtime}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
                required
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Monto Total Horas Extras
              </label>
              <input
                type="number"
                name="totalExtraHoursAmount"
                value={formData.totalExtraHoursAmount}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Horas Dobles</label>
              <input
                type="number"
                name="doubleExtras"
                value={formData.doubleExtras}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Días Trabajados</label>
              <input
                type="number"
                name="workedDays"
                value={formData.workedDays}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              />
            </div>
          </div>
  
          {/* Columna derecha */}
          <div className="space-y-6">
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Horas Nocturnas</label>
              <input
                type="number"
                name="nightHours"
                value={formData.nightHours}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Ajustes</label>
              <input
                type="number"
                name="adjustments"
                value={formData.adjustments}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Incapacidad</label>
              <input
                type="number"
                name="incapacity"
                value={formData.incapacity}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Ausencia</label>
              <input
                type="number"
                name="absence"
                value={formData.absence}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Vacaciones</label>
              <input
                type="number"
                name="vacationDays"
                value={formData.vacationDays}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`text-lg font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notas</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              />
            </div>
          </div>
  
          {/* Deducciones */}
          <div className="col-span-2 space-y-6 mt-8">
            <h3 className={`text-lg font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Deducciones</h3>
            {formData.deductionsList.map((deduction, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="type"
                  value={deduction.type}
                  onChange={(e) => handleDeductionsChange(index, e)}
                  className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
                  placeholder="Tipo"
                  required
                />
                <input
                  type="number"
                  name="amount"
                  value={deduction.amount}
                  onChange={(e) => handleDeductionsChange(index, e)}
                  className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
                  placeholder="Monto"
                  required
                />
                <button type="button" onClick={() => removeDeduction(index)} className="bg-red-500 text-white p-3 rounded-md">
                  Eliminar
                </button>
              </div>
            ))}
            <button type="button" onClick={addDeduction} className="bg-blue-500 text-white p-3 rounded-md">
              Agregar Deducción
            </button>
          </div>
  
          <div className="col-span-2 flex justify-center space-x-4 mt-8">
            {/* Botón Generar Comprobante */}
            <button
              type="submit"
              className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md 
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                text-white transition-all duration-300`}
              disabled={isLoading}
            >
              {isLoading ? 'Generando...' : 'Generar Comprobante'}
            </button>
  
            {/* Botón Descargar PDF */}
            {generatedReceiptId && (
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
              disabled={downloadLoading}
              >
            {downloadLoading ? <LoadingSpinner/> : 'Descargar PDF'}
              </button>
            )}
  
            {/* Botón Enviar Comprobante */}
            {generatedReceiptId && <SendPaymentReceiptForm receiptId={generatedReceiptId} />}
          </div>
        </form>
        <Toast message={message} type={type} />
      </div>
    );
  };
  
  export default PaymentReceiptForm;
  