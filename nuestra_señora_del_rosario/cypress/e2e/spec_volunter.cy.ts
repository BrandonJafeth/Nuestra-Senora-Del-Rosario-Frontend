describe('VolunteerRequests', () => {
    beforeEach(() => {
      // Visita la URL de la página de solicitudes de voluntariado
      cy.visit('http://localhost:5173/dashboard/solicitudes/voluntariado');
    });
  
    it('debería mostrar las solicitudes de voluntariado', () => {
      cy.contains('Solicitudes de Voluntarios').should('be.visible');
      cy.contains('John Doe Smith').should('be.visible');
    });
  
    it('debería filtrar las solicitudes por estado', () => {
      cy.contains('Aceptada').click();
      cy.contains('John Doe Smith').should('not.exist');
    });
  
    it('debería actualizar el estado de una solicitud a "Aceptada"', () => {
      cy.contains('Editar').click();
      cy.contains('Aceptar').click();
      cy.contains('Solicitud aceptada exitosamente').should('be.visible');
    });
  
    it('debería actualizar el estado de una solicitud a "Rechazada"', () => {
      cy.contains('Editar').click();
      cy.contains('Rechazar').click();
      cy.contains('Solicitud rechazada exitosamente').should('be.visible');
    });
  });