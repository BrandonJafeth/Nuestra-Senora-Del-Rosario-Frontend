


// services/GuardianService.ts
import { GalleryCategory } from '../types/GalleryCategoryType';
import ApiService from './GenericService/ApiService';

class GalleryCategoryService extends ApiService<GalleryCategory> {
  constructor() {
    super(); // Utilizar el constructor base de ApiService
  }

    // Obtener todas las galerias
    public getAllGalleryCategories() {
      return this.getAll('/GalleryCategory');
    }

}

const galleryCategoryService = new GalleryCategoryService();
export default galleryCategoryService;
