// services/PaymentReceiptService.ts
import ApiService from './GenericService/ApiService';

class PaymentReceiptService extends ApiService<any> {
  
  // Método específico para crear un comprobante de pago
  public createPaymentReceipt(data: any) {
    return this.create('/PaymentReceipt', data);
  }

  // Método para enviar el comprobante al correo del empleado
  public sendPaymentReceiptByEmail(receiptId: number) {
    // Usamos `create` pero no necesitamos pasar un cuerpo de datos
    return this.create(`/PaymentReceiptPdf/send/${receiptId}`, {}); // Enviamos un objeto vacío porque el endpoint no necesita datos
  }
}

const paymentReceiptService = new PaymentReceiptService();
export default paymentReceiptService;
