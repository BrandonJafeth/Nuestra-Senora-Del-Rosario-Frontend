/// <reference types="cypress" />

describe('EmployeeForm Component', () => {
    beforeEach(() => {

        cy.visit('http://localhost:5173/');
    cy.get('input[placeholder="Cédula"]').type('1234');
    cy.get('input[placeholder="Contraseña"]').type('SA123');
    cy.get('button').contains('Iniciar sesión').click();
    cy.contains('Inicio de sesión exitoso', { timeout: 5000 }).should('be.visible');

      // Visita la página donde se renderiza el EmployeeForm.
      // Ajusta la URL según corresponda.
      cy.visit('http://localhost:5173/dashboard/personal/registro');
    });
  
    it('debería renderizar el formulario con todos sus campos y botones', () => {
      cy.contains('Registro de empleados').should('be.visible');
      cy.get('input[placeholder="Ingrese su nombre"]').should('exist');
      cy.get('input[placeholder="Ingrese su primer apellido"]').should('exist');
      cy.get('input[placeholder="Ingrese su segundo apellido"]').should('exist');
      cy.get('input[placeholder="Ingrese su cédula"]').should('exist');
      cy.get('input[placeholder="Ingrese su correo"]').should('exist');
      cy.get('input[placeholder="Ingrese su teléfono"]').should('exist');
      cy.get('input[placeholder="Ingrese su dirección"]').should('exist');
      cy.contains('Seleccione una profesión').should('exist');
      cy.contains('Seleccione un tipo de salario').should('exist');
      cy.get('input[placeholder="Ingrese el contacto de emergencia"]').should('exist');
      cy.contains('Agregar').should('be.visible');
      cy.contains('Cancelar').should('be.visible');
    });
  
    it('debería mostrar error "El nombre es requerido" si el campo Nombre está vacío', () => {
      // Dejar el campo "Nombre" vacío y llenar los demás con datos válidos.
      cy.get('input[placeholder="Ingrese su primer apellido"]').type('Doe');
      cy.get('input[placeholder="Ingrese su segundo apellido"]').type('Smith');
      cy.get('input[placeholder="Ingrese su cédula"]').type('123456789'); // 9 dígitos válidos
      cy.get('input[placeholder="Ingrese su correo"]').type('john@example.com');
      cy.get('input[placeholder="Ingrese su teléfono"]').type('12345678'); // 8 dígitos
      cy.get('input[placeholder="Ingrese su dirección"]').type('123 Main St');
      // Seleccionar opciones válidas para los selects (ajusta los valores si es necesario)
      cy.get('select').first().select('1');
      cy.get('select').eq(1).select('1');
      cy.get('input[placeholder="Ingrese el contacto de emergencia"]').type('87654321');
  
      cy.contains('Agregar').click();
      cy.contains('El nombre es requerido').should('be.visible');
    });
  
    it('debería mostrar error "La cédula debe contener solo numeros entre 9 y 12 dígitos" si el DNI es inválido', () => {
      cy.get('input[placeholder="Ingrese su nombre"]').type('John');
      cy.get('input[placeholder="Ingrese su primer apellido"]').type('Doe');
      cy.get('input[placeholder="Ingrese su segundo apellido"]').type('Smith');
      // DNI inválido: letras o longitud incorrecta
      cy.get('input[placeholder="Ingrese su cédula"]').type('abc');
      cy.get('input[placeholder="Ingrese su correo"]').type('john@example.com');
      cy.get('input[placeholder="Ingrese su teléfono"]').type('12345678');
      cy.get('input[placeholder="Ingrese su dirección"]').type('123 Main St');
      cy.get('select').first().select('1');
      cy.get('select').eq(1).select('1');
      cy.get('input[placeholder="Ingrese el contacto de emergencia"]').type('87654321');
  
      cy.contains('Agregar').click();
      cy.contains('La cédula debe contener solo numeros entre 9 y 12 dígitos').should('be.visible');
    });
  
    it('debería mostrar error "Ingrese un correo electrónico válido" si el email es inválido', () => {
      cy.get('input[placeholder="Ingrese su nombre"]').type('John');
      cy.get('input[placeholder="Ingrese su primer apellido"]').type('Doe');
      cy.get('input[placeholder="Ingrese su segundo apellido"]').type('Smith');
      cy.get('input[placeholder="Ingrese su cédula"]').type('123456789');
      // Email inválido (sin @ o sin .com)
      cy.get('input[placeholder="Ingrese su correo"]').type('johnexample.com');
      cy.get('input[placeholder="Ingrese su teléfono"]').type('12345678');
      cy.get('input[placeholder="Ingrese su dirección"]').type('123 Main St');
      cy.get('select').first().select('1');
      cy.get('select').eq(1).select('1');
      cy.get('input[placeholder="Ingrese el contacto de emergencia"]').type('87654321');
  
      cy.contains('Agregar').click();
      cy.contains('Ingrese un correo electrónico válido').should('be.visible');
    });
  
    it('debería enviar el formulario exitosamente con datos válidos y mostrar el toast de éxito', () => {
      // Completar el formulario con datos válidos.
      cy.get('input[placeholder="Ingrese su nombre"]').type('John');
      cy.get('input[placeholder="Ingrese su primer apellido"]').type('Doe');
      cy.get('input[placeholder="Ingrese su segundo apellido"]').type('Smith');
      cy.get('input[placeholder="Ingrese su cédula"]').type('123456789');
      cy.get('input[placeholder="Ingrese su correo"]').type('john@example.com');
      cy.get('input[placeholder="Ingrese su teléfono"]').type('12345678');
      cy.get('input[placeholder="Ingrese su dirección"]').type('123 Main St');
      cy.get('select').first().select('1');
      cy.get('select').eq(1).select('1');   
      cy.get('input[placeholder="Ingrese el contacto de emergencia"]').type('87654321');
  
      cy.contains('Agregar').click();
      cy.contains('Empleado registrado exitosamente').should('be.visible');
    });
  
    it('debería limpiar los campos al hacer click en "Cancelar"', () => {
      // Llenar algunos campos.
      cy.get('input[placeholder="Ingrese su nombre"]').type('John');
      cy.get('input[placeholder="Ingrese su primer apellido"]').type('Doe');
      cy.get('input[placeholder="Ingrese su correo"]').type('john@example.com');
      // Hacer click en "Cancelar"
      cy.contains('Cancelar').click();
      // Verificar que los campos hayan quedado vacíos.
      cy.get('input[placeholder="Ingrese su nombre"]').should('have.value', '');
      cy.get('input[placeholder="Ingrese su primer apellido"]').should('have.value', '');
      cy.get('input[placeholder="Ingrese su correo"]').should('have.value', '');
    });
  });
  