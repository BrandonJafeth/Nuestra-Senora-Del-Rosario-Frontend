describe('Pruebas de solicitud de restablecimiento de contraseña', () => {
    beforeEach(() => {
      // Visita la URL por defecto antes de cada prueba
      cy.visit('http://localhost:5173/');
    });
  
    it('Debería mostrar un mensaje de error si el campo de correo electrónico está vacío', () => {
      // Navegar al formulario de solicitud de restablecimiento de contraseña
      cy.contains('¿Olvidó su contraseña?').click();
  
      // Intentar enviar el formulario sin rellenar el campo de correo electrónico
      cy.get('button[type="submit"]').contains('Enviar enlace de restablecimiento').click();
  
      // Verificar que se muestra el mensaje de error en el toast
      cy.contains('El correo electrónico es requerido.', { timeout: 5000 }).should('be.visible');
    });
  
    it('Debería enviar el enlace de restablecimiento de contraseña con un correo válido', () => {
      // Navegar al formulario de solicitud de restablecimiento de contraseña
      cy.contains('¿Olvidó su contraseña?').click();
  
      // Rellenar el campo de correo electrónico con un correo válido
      cy.get('input[placeholder="Ingrese su correo electrónico"]').type('brandoncarrilloalvarez2@gmail.com');
      cy.get('button[type="submit"]').contains('Enviar enlace de restablecimiento').click();
  
      // Verificar que se muestra un mensaje de éxito en el toast
      cy.contains('Enlace de restablecimiento enviado exitosamente. Por favor revise su correo electrónico', { timeout: 10000 }).should('be.visible');
    });
  });