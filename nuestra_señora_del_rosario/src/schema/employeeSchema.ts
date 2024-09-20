import { z } from 'zod';

export const employeeSchema = z.object({
  dni: z.string()
    .min(1, 'El DNI es requerido')
    .regex(/^\d{9,10}$/, 'El DNI debe ser un número de 9 o 10 dígitos'),
  firstName: z.string()
    .min(1, 'El primer nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  lastName1: z.string()
    .min(1, 'El primer apellido es requerido')
    .min(2, 'El primer apellido debe tener al menos 2 caracteres')
    .max(50, 'El primer apellido no puede exceder los 50 caracteres'),
  lastName2: z.string()
    .min(1, 'El segundo apellido es requerido')
    .min(2, 'El segundo apellido debe tener al menos 2 caracteres')
    .max(50, 'El segundo apellido no puede exceder los 50 caracteres'),
  phoneNumber: z.string()
    .min(1, 'El número de teléfono es requerido')
    .regex(/^\d{10}$/, 'El número de teléfono debe tener 10 dígitos'),
  address: z.string()
    .min(1, 'La dirección es requerida')
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder los 200 caracteres'),
  email: z.string()
    .min(1, 'El correo electrónico es requerido')
    .email('El correo electrónico no es válido')
    .max(100, 'El correo electrónico no puede exceder los 100 caracteres'),
  emergencyPhone: z.string()
    .min(1, 'El teléfono de emergencia es requerido')
    .regex(/^\d{10}$/, 'El teléfono de emergencia debe tener 10 dígitos'),
  profession: z.string()
    .min(1, 'La profesión es requerida'),
  typeOfSalaryId: z.string()
    .min(1, 'El tipo de salario es requerido')
});

export type EmployeeFormInputs = z.infer<typeof employeeSchema>;