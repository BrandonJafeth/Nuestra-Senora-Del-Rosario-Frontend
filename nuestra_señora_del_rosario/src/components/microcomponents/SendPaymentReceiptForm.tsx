import React, { useState } from 'react';
import { useSendPaymentReceiptByEmail } from '../../hooks/useSendPaymentReceiptByEmail';
import { useToast } from '../../hooks/useToast'; // Importar el hook de notificaciones
import Toast from '../common/Toast';

interface SendPaymentReceiptFormProps {
  receiptId: number; // El ID del comprobante generado
}

const SendPaymentReceiptForm: React.FC<SendPaymentReceiptFormProps> = ({ receiptId }) => {
  const [isSent, setIsSent] = useState(false);
  const { mutate: sendPaymentReceipt, isLoading } = useSendPaymentReceiptByEmail(receiptId);
  const { showToast, message, type } = useToast(); // Usar el hook de Toast

  const handleSendEmail = () => {
    sendPaymentReceipt(undefined, { // No pasamos datos, solo usamos el receiptId
      onSuccess: () => {
        setIsSent(true);
        showToast('Comprobante enviado correctamente al correo del empleado.', 'success'); // Notificación de éxito
      },
      onError: () => {
        showToast('Error al enviar el comprobante.', 'error'); // Notificación de error
      },
    });
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleSendEmail}
        disabled={isLoading || isSent}
        className={`w-full max-w-xs px-6 py-3 text-lg font-medium rounded-lg shadow-md 
          ${isLoading || isSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
          text-white transition-all duration-300`}
      >
        {isLoading ? 'Enviando...' : isSent ? 'Comprobante Enviado' : 'Enviar Comprobante'}
      </button>
      <Toast message={message} type={type} />
    </div>
  );
};

export default SendPaymentReceiptForm;
