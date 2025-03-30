// cypress/e2e/spec_emailpassword.cy.ts

describe('Pruebas de solicitud de restablecimiento de contraseña', () => {
  beforeEach(() => {
    // Visita la URL por defecto antes de cada prueba
    cy.visit('http://localhost:5173/');
    
    // Esperar a que la página cargue completamente
    cy.get('body').should('be.visible');
  });

  it('Debería mostrar un mensaje de error si el campo de correo electrónico está vacío', () => {
    // Navegar al formulario de solicitud de restablecimiento de contraseña
    cy.contains('a', '¿Olvidó su contraseña?').click();
    
    // Verificar que se ha navegado a la página de restablecimiento
    cy.url().should('include', '/reset-password');
    
    // Intentar enviar el formulario sin rellenar el campo de correo electrónico
    cy.get('button[type="submit"]').click();
    
    // Verificar que se muestra el mensaje de error
    cy.contains('El correo electrónico es requerido.').should('be.visible');
  });

  it('Debería enviar el enlace de restablecimiento de contraseña con un correo válido', () => {
    // Navegar al formulario de solicitud de restablecimiento de contraseña
    cy.contains('a', '¿Olvidó su contraseña?').click();
    
    // Verificar que estamos en la página correcta
    cy.url().should('include', '/reset-password');
    
    // Rellenar el campo de correo electrónico con un correo válido
    cy.get('input[type="email"]').type('brandoncarrilloalvarez2@gmail.com');
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click();
    
    // Verificar que se muestra un mensaje de éxito
    cy.contains('Enlace de restablecimiento enviado exitosamente').should('be.visible');
  });

  it('Debería mostrar un mensaje de error con un formato de correo inválido', () => {
    // Navegar al formulario
    cy.contains('a', '¿Olvidó su contraseña?').click();
    
    // Ingresar un correo con formato inválido
    cy.get('input[type="email"]').type('correo-invalido');
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click();
    
    // Verificar mensaje de error
    cy.contains('Ingrese un correo electrónico válido').should('be.visible');
  });
});