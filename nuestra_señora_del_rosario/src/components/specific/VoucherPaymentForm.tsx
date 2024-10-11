import React, { useState } from 'react';
import { PaymentReceiptType } from '../../types/PaymentReceiptType';
import { useCreatePaymentReceipt } from '../../hooks/useCreatePaymentReceipt';
import SendPaymentReceiptForm from '../microcomponents/SendPaymentReceiptForm';
import { useLocation } from 'react-router-dom';

const PaymentReceiptForm: React.FC = () => {
  const location = useLocation(); 
  const { state } = location; // Obtenemos el estado desde la navegación
  const employeeDniFromState = state?.employeeDni || 0; // Si existe un employeeDni en el estado lo usamos, sino 0

  const [formData, setFormData] = useState<PaymentReceiptType>({
    id: 0,
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
  const { mutate: createPaymentReceipt, isLoading, isSuccess, isError } = useCreatePaymentReceipt();

  // Enlace para descargar el comprobante en formato PDF
  const downloadLink = generatedReceiptId
    ? `https://localhost:7066/api/PaymentReceipt/DownloadPaymentReceiptPdf/${generatedReceiptId}`
    : null;

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
        alert('Comprobante generado correctamente.');
      },
      onError: () => {
        alert('Error al generar el comprobante.');
      },
    });
  };

  return (
    <div className="w-full max-w-[1169px] mx-auto p-6 bg-white rounded-[20px] shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center font-poppins text-gray-800">
        Generar Comprobante de Pago
      </h2>

      {/* Formulario */}
      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Columna izquierda */}
        <div className="space-y-6">
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Cédula del Empleado</label>
            <input
              type="number"
              name="employeeDni"
              value={formData.employeeDni}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#D2D7DD] text-gray-900"
              disabled
            />
          </div>
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Fecha de Pago</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
              required
            />
          </div>
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Salario</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
              required
            />
          </div>
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Horas Extra</label>
            <input
              type="number"
              name="overtime"
              value={formData.overtime}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
              required
            />
          </div>
          <div>
  <label className="text-lg font-poppins mb-2 text-gray-800">Monto Total Horas Extras</label>
  <input
    type="number"
    name="totalExtraHoursAmount"
    value={formData.totalExtraHoursAmount}
    onChange={handleChange}
    className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
  />
</div>
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Horas Dobles</label>
            <input
              type="number"
              name="doubleExtras"
              value={formData.doubleExtras}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
            />
          </div>
          <div>
  <label className="text-lg font-poppins mb-2 text-gray-800">Días Trabajados</label>
  <input
    type="number"
    name="workedDays"
    value={formData.workedDays}
    onChange={handleChange}
    className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
  />
</div>


        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
        <div>
  <label className="text-lg font-poppins mb-2 text-gray-800">Ingreso Bruto</label>
  <input
    type="number"
    name="grossIncome"
    value={formData.grossIncome}
    onChange={handleChange}
    className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
  />
</div>
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Horas Nocturnas</label>
            <input
              type="number"
              name="nightHours"
              value={formData.nightHours}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
            />
          </div>
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Ajustes</label>
            <input
              type="number"
              name="adjustments"
              value={formData.adjustments}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
            />
          </div>
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Incapacidad</label>
            <input
              type="number"
              name="incapacity"
              value={formData.incapacity}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
            />
          </div>
          <div>
  <label className="text-lg font-poppins mb-2 text-gray-800">Ausencia</label>
  <input
    type="number"
    name="absence"
    value={formData.absence}
    onChange={handleChange}
    className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
  />
</div>
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Vacaciones</label>
            <input
              type="number"
              name="vacationDays"
              value={formData.vacationDays}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
            />
          </div>
          <div>
            <label className="text-lg font-poppins mb-2 text-gray-800">Notas</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#f2f4f7] text-gray-900"
            />
          </div>
        </div>

        {/* Deducciones */}
        <div className="col-span-2 space-y-6 mt-8">
          <h3 className="text-lg font-poppins text-gray-800">Deducciones</h3>
          {formData.deductionsList.map((deduction, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="type"
                value={deduction.type}
                onChange={(e) => handleDeductionsChange(index, e)}
                className="p-3 rounded-md bg-[#f2f4f7] text-gray-900"
                placeholder="Tipo"
                required
              />
              <input
                type="number"
                name="amount"
                value={deduction.amount}
                onChange={(e) => handleDeductionsChange(index, e)}
                className="p-3 rounded-md bg-[#f2f4f7] text-gray-900"
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
    <a
      href={downloadLink!}
      className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      Descargar PDF
    </a>
  )}

  {/* Botón Enviar Comprobante */}
  {generatedReceiptId && (
    <SendPaymentReceiptForm receiptId={generatedReceiptId} />
  )}
</div>
      </form>
    </div>
  );
};

export default PaymentReceiptForm;
