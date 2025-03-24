import { NoteRequest } from '../types/NoteTypes';
import ApiService from './GenericService/ApiService';
import Cookies from 'js-cookie';

class NoteService extends ApiService<NoteRequest> {
  constructor() {
    super(); 
  }

  public getAllNotes = async () => {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return await this.getWithHeaders<NoteRequest[]>('/Note', {
      Authorization: `Bearer ${token}`,
    });
  };
  
  public getNotesById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<NoteRequest>(`/Note/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  public createNotes(data: NoteRequest) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.postWithHeaders('/Note', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public updateNotes(id: number, data: Partial<NoteRequest>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.patchWithHeaders(`/Note/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public deleteNotes(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.deleteWithHeaders('/Note', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const notesService = new NoteService();
export default notesService;
