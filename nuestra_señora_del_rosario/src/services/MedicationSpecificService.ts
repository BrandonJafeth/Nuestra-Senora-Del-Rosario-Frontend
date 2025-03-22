import { MedicationSpecific } from '../types/MedicationSpecificType';
import ApiService from './GenericService/ApiService';
import Cookies from 'js-cookie';

class MedicationSpecificService extends ApiService<MedicationSpecific> {
  constructor() {
    super();
  }

  // GET /api/MedicationSpecific con token en la cabecera
  public getAllMedicationSpecific = async () => {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<MedicationSpecific[]>('/MedicationSpecific', {
      Authorization: `Bearer ${token}`,
    });
  };

  // GET /api/MedicationSpecific/{id}
  public getMedicationSpecificById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<MedicationSpecific>(`/MedicationSpecific/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/MedicationSpecific
  public createMedicationSpecific(data: MedicationSpecific) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<MedicationSpecific>('/MedicationSpecific', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PATCH /api/MedicationSpecific/{id}
  public updateMedicationSpecific(id: number, data: Partial<MedicationSpecific>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.updateWithHeaders(`/MedicationSpecific/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // DELETE /api/MedicationSpecific/{id}
  public deleteMedicationSpecific(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>('/MedicationSpecific', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const medicationSpecificService = new MedicationSpecificService();
export default medicationSpecificService;
