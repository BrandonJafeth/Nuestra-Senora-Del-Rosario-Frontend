import Cookies from "js-cookie";
import ApiService from "./GenericService/ApiService";
import { DonationRequest } from "../types/DonationType";

class DonationService extends ApiService<DonationRequest> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // GET /api/FormDonation
  public getAllDonationRequests() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.getWithHeaders<DonationRequest[]>("/FormDonation", {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET con paginación usando el método que permite enviar headers
  public getAllDonationsPages(page: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getAllPagesWithHeaders("/FormDonation", page, pageSize, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/FormDonation/{id}
  public getDonationRequestById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<DonationRequest>(`/FormDonation/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/FormDonation
  public createDonationRequest(data: DonationRequest) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<DonationRequest>("/FormDonation", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PATCH /api/FormDonation/{id}/status
  public updateDonationRequest(id: number, data: Partial<DonationRequest>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.patchWithHeaders(`/FormDonation/${id}/status`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // DELETE /api/FormDonation/{id}
  public deleteDonationRequest(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>("/FormDonation", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const donationService = new DonationService();
export default donationService;
