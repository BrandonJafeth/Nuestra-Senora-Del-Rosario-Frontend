/// <reference types="cypress" />

describe('DonationRequests', () => {
    beforeEach(() => {
      // Visita la URL principal primero
      cy.visit('http://localhost:5173/');
      
      // Iniciar sesión con credenciales válidas
      cy.get('input[placeholder="Cédula"]').type('1234');
      cy.get('input[placeholder="Contraseña"]').type('SA123');
      cy.get('button').contains('Iniciar sesión').click();
      
      // Verificar que el inicio de sesión fue exitoso
      cy.contains('Inicio de sesión exitoso', { timeout: 5000 }).should('be.visible');
      
      // Navegar a la página de solicitudes de donaciones
      cy.visit('http://localhost:5173/dashboard/solicitudes/donaciones');
      
      // Esperar a que la página cargue completamente
      cy.contains('Solicitudes de Donaciones', { timeout: 10000 }).should('be.visible');
    });
  
    it('debería mostrar las solicitudes de donaciones', () => {
      // Se asume que existe una solicitud con el nombre "Juan Perez Gomez"
      cy.contains('Ulises Zuñiga Pizarro').should('be.visible');
    });
  
    it('debería filtrar las solicitudes por estado', () => {
      // Por ejemplo, al filtrar por estado "Aprobado" se oculta la solicitud "Juan Perez Gomez"
      cy.contains('Aprobado').click();
      cy.contains('Ulises Zuñiga Pizarro').should('not.exist');
    });
  
    it('debería actualizar el estado de una solicitud a "Aceptada"', () => {
      // Abrir el modal de detalles haciendo click en "Editar"
      cy.contains('Editar').click();
      // En el modal, hacer click en "Aceptar"
      cy.contains('Aceptar').click();
      // Verificar que se muestre un mensaje de éxito
      cy.contains('Donación aceptada exitosamente').should('be.visible');
    });
    
    it('debería mostrar un mensaje que la donación ya ha sido aceptada', () => {
      // Abrir el modal y hacer click en "Aceptar"
      cy.contains('Editar').click();
      cy.contains('Aceptar').click();
      // Se espera que, si la donación ya fue aprobada, se muestre este mensaje
      cy.contains('Esta donación ya ha sido aceptada', { timeout: 10000 }).should('be.visible');
    });
  
    it('debería actualizar el estado de una solicitud a "Rechazada"', () => {
      // Abrir el modal de detalles haciendo click en "Editar"
      cy.contains('Editar').click();
      // Hacer click en "Rechazar"
      cy.contains('Rechazar').click();
      // Verificar que se muestre el mensaje correspondiente
      cy.contains('Donación rechazada exitosamente', { timeout: 10000 }).should('be.visible');
    });
  });
  