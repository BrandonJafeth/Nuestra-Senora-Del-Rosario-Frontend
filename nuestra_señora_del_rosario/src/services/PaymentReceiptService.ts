// services/PaymentReceiptService.ts
import Cookies from "js-cookie";
import ApiService from "./GenericService/ApiService";

class PaymentReceiptService extends ApiService<any> {
  
  // Método específico para crear un comprobante de pago
  public createPaymentReceipt(data: any) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<any>("/PaymentReceipt", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Método para enviar el comprobante al correo del empleado
  public sendPaymentReceiptByEmail(receiptId: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Enviamos un objeto vacío porque el endpoint no necesita datos
    return this.postWithHeaders<any>(`/PaymentReceiptPdf/send/${receiptId}`, {}, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const paymentReceiptService = new PaymentReceiptService();
export default paymentReceiptService;
