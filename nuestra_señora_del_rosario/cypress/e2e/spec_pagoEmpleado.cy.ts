/// <reference types="cypress" />
/// <reference types="mocha" />

describe('Flujo de generación de comprobante de pago', () => {
    beforeEach(() => {
      // Iniciar sesión
      cy.visit('http://localhost:5173/');
      cy.get('input[placeholder="Cédula"]').type('1234');
      cy.get('input[placeholder="Contraseña"]').type('SA123');
      cy.get('button').contains('Iniciar sesión').click();
      cy.contains('Inicio de sesión exitoso', { timeout: 5000 }).should('be.visible');
  
      // Ir a la lista de empleados
      cy.visit('http://localhost:5173/dashboard/personal/lista');
    });
  
    it('Debería generar y descargar un comprobante de pago para el primer empleado', () => {
      // Esperar a que cargue la lista
      cy.contains('Lista de empleados', { timeout: 10000 }).should('be.visible');
  
      // Hacer clic en "Generar comprobante" del primer empleado
      cy.contains('Generar comprobante').first().click();
  
      // Validar que estamos en la vista correcta
      cy.contains('Generarcomprobante de pago').should('be.visible');
  
      // Llenar campos obligatorios del formulario
      cy.get('input[name="salary"]').type('400000');
      cy.get('input[name="overtime"]').type('10');
      cy.get('input[name="workedDays"]').type('20');
  
      // Agregar una deducción
      cy.get('input[name="type"]').last().type('CCSS');
      cy.get('input[name="amount"]').last().type('12000');
  
      // Enviar el formulario
      cy.contains('Generar Comprobante').click();
  
      // Confirmar el toast de éxito
      cy.contains('Comprobante generado correctamente', { timeout: 5000 }).should('be.visible');
  
      // Esperar a que se habilite el botón de descarga y hacer clic
      cy.contains('Descargar PDF', { timeout: 5000 }).should('be.visible').click();
  
      // Validar que el PDF se haya descargado (esto requiere plugin de descargas si se desea validar el archivo)
      // Por defecto solo se asegura que se haya hecho clic y no haya errores
    });
  });
  