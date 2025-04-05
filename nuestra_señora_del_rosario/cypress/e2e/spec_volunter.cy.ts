/// <reference types="cypress" />

describe('VolunteerRequests', () => {
  beforeEach(() => {
    // Visita la URL principal primero
    cy.visit('http://localhost:5173/');
    
    // Iniciar sesión con credenciales válidas
    cy.get('input[placeholder="Cédula"]').type('1234');
    cy.get('input[placeholder="Contraseña"]').type('SA123');
    cy.get('button').contains('Iniciar sesión').click();
    
    // Verificar que el inicio de sesión fue exitoso
    cy.contains('Inicio de sesión exitoso', { timeout: 5000 }).should('be.visible');
    
    // Navegar a la página de solicitudes de voluntariado
    cy.visit('http://localhost:5173/dashboard/solicitudes/voluntariado');
    
    // Esperar a que la página cargue completamente
    cy.contains('Solicitudes de Voluntarios', { timeout: 10000 }).should('be.visible');
  });

  it('debería mostrar las solicitudes de voluntariado', () => {
    cy.contains('Pedro Aguilar Serrano').should('be.visible');
  });

  it('debería filtrar las solicitudes por estado', () => {
    cy.contains('Aprobado').click();
    cy.contains('Pedro Aguilar Serrano').should('not.exist');
  });

  it('debería actualizar el estado de una solicitud a "Aceptada"', () => {
    cy.contains('Editar').click();
    cy.contains('Aceptar').click();
    cy.contains('Solicitud de voluntario aceptada').should('be.visible');
  });
  
  it('debería mostrar un mensaje que la solicitud ya ha sido aceptada', () => {
    cy.contains('Editar').click();
    cy.contains('Aceptar').click();
    cy.contains('Esta solicitud ya ha sido aceptada',{ timeout: 10000 }).should('be.visible');
  });

  it('debería actualizar el estado de una solicitud a "Rechazada"', () => {
    cy.contains('Editar').click();
    cy.contains('Rechazar').click();
    cy.contains('Solicitud de voluntario rechazada',{ timeout: 10000 }).should('be.visible');
  });

});