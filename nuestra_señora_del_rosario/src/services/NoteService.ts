import { NoteRequest } from '../types/NoteTypes';
import ApiService from './GenericService/ApiService'; 

class NoteService extends ApiService<NoteRequest> {
  constructor() {
    super(); 
  }

  public getAllNotes = async () => {
    return await this.getAll('/Note');
  };
  

  public getNotesById(id: number) {
    return this.getOne('/Note', id);
  }

  public createNotes(data: NoteRequest) {
    return this.create('/Note', data);
  }

  public updateNotes(id: number, data: Partial<NoteRequest>) {
    return this.patch(`/Note/${id}`, id, data); 
  }

  public deleteNotes(id: number) {
    return this.delete('/Note', id);
  }
}

const notesService = new NoteService();
export default notesService;
