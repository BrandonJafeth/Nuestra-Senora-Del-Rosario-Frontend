describe('Pruebas de inicio de sesión', () => {
    beforeEach(() => {
      // Visita la URL por defecto antes de cada prueba
      cy.visit('http://localhost:5173/');
    });
  
    it('Debería mostrar un mensaje de error si las credenciales son incorrectas', () => {
      // Rellenar formulario de inicio de sesión con credenciales incorrectas
      cy.get('input[placeholder="Cédula"]').type('122548263');
      cy.get('input[placeholder="Contraseña"]').type('contraseña_incorrecta');
      cy.get('button').contains('Iniciar sesión').click();
  
      // Verificar que se muestra el mensaje de error en el toast
      cy.contains('Credenciales Incorrectas. Por favor, intente nuevamente.', { timeout: 10000 }).should('be.visible');
    });
  
    it('Debería mostrar un mensaje de error si los campos están vacíos', () => {
      // Intentar enviar el formulario sin rellenar los campos
      cy.get('button').contains('Iniciar sesión').click();
  
      // Verificar que se muestra el mensaje de error en el toast para los campos vacíos
      cy.contains('Por favor ingrese su cédula y contraseña', { timeout: 5000 }).should('be.visible');
    });
  
    it('Debería iniciar sesión correctamente con credenciales válidas', () => {
      // Rellenar formulario de inicio de sesión con credenciales válidas
      cy.get('input[placeholder="Cédula"]').type('123456789');
      cy.get('input[placeholder="Contraseña"]').type('ABCD1234');
      cy.get('button').contains('Iniciar sesión').click();
  
      // Verificar que se muestra un mensaje de éxito en el toast
      cy.contains('Inicio de sesión exitoso', { timeout: 5000 }).should('be.visible');
  
      // Verificar que se redirige al dashboard
      cy.url().should('include', '/dashboard');
    });
  });