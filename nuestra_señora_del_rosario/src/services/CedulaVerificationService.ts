// src/services/CedulaVerificationService.ts
import Cookies from 'js-cookie'
import ApiService from './GenericService/ApiService'
import { CedulaVerificationResponse } from '../types/CedulaType'

class CedulaVerificationService extends ApiService<CedulaVerificationResponse> {
  constructor() {
    super()
  }

  /**
   * GET /api/cedula-verification/verify?cedula={cedula}
   * Verifica si la cédula ya existe en el sistema (empleado, residente o tutor).
   */
  public verifyCedula(cedula: string) {
    const token = Cookies.get('authToken')
    if (!token) throw new Error('No se encontró un token de autenticación')

    // Construimos la URL con query param
    const url = `/cedula-verification/verify?cedula=${encodeURIComponent(cedula)}`

    return this.getWithHeaders<CedulaVerificationResponse>(url, {
      Authorization: `Bearer ${token}`,
    })
  }
}

const cedulaVerificationService = new CedulaVerificationService()
export default cedulaVerificationService
