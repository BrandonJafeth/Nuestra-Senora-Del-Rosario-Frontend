
import { Pathology } from '../types/PathologyType';
import ApiService from './GenericService/ApiService'; 

class PathologyService extends ApiService<Pathology> {
  constructor() {
    super(); 
  }

  public getAllPathologies = async () => {
    return await this.getAll('/Pathology');
  };
  

  public getPathologiesById(id: number) {
    return this.getOne('/Pathology', id);
  }

  public createPathologies(data: Pathology) {
    return this.create('/Pathology', data);
  }

  public updatePathologies(id: number, data: Partial<Pathology>) {
    return this.patch(`/Pathology/${id}`, id, data); 
  }

  public deletePathologies(id: number) {
    return this.delete('/Pathology', id);
  }
}

const pathologysService = new PathologyService();
export default pathologysService;
