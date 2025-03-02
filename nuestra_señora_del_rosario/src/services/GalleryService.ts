


// services/GuardianService.ts
import ApiService from './GenericService/ApiService';
import { Gallery } from '../types/GalleryType';

class GalleryService extends ApiService<Gallery> {
  constructor() {
    super(); // Utilizar el constructor base de ApiService
  }

    // Obtener todas las galerias
    public getAllGallery() {
      return this.getAll('/Gallery');
    }

    public addGalleryItem(id_GalleryCategory: number, gallery_Image_Url: string) {
      return this.create("/GalleryItem", {
        id_GalleryCategory,
        gallery_Image_Url,
        id_GalleryItem: 0
      });
    }


    public deleteGalleryItem(id_GalleryItem: number) {
      return this.delete('/GalleryItem', id_GalleryItem);
    }

}

const galleryService = new GalleryService();
export default galleryService;
