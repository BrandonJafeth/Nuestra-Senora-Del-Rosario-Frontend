// src/types/cedulaVerification.ts
export interface CedulaEntity {
  /** Nombre de la entidad donde se busca la cédula */
  entityName: 'Employee' | 'Resident' | 'Guardian'
  /** Indica si la cédula existe en esta entidad */
  existsInEntity: boolean
  /** El ID dentro de esa entidad (si existe) */
  entityId: number | null
  /** Nombre para mostrar (por ejemplo, nombre completo); null si no existe */
  displayName: string | null
}

/** Respuesta del endpoint /cedula-verification/verify */
export interface CedulaVerificationResponse {
  /** Si la cédula existe en **alguna** de las entidades */
  exists: boolean
  /** Detalle por cada tipo de entidad */
  entities: CedulaEntity[]
}
