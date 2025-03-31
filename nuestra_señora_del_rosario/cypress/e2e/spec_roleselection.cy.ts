describe('RoleSelection Component', () => {
    // Antes de cada prueba, se limpian las cookies para evitar interferencias
    beforeEach(() => {
      cy.clearCookies();
    });
  
    context('cuando el usuario tiene un solo rol', () => {
        beforeEach(() => {
          // Simular el inicio de sesión visitando la URL principal
          cy.visit('https://nuestra-senora-del-rosario-frontend.vercel.app/');
          cy.get('input[placeholder="Cédula"]').type('102340567');
          cy.get('input[placeholder="Contraseña"]').type('Trbn-2004');
          cy.get('button').contains('Iniciar sesión').click();
          cy.contains('Inicio de sesión exitoso', { timeout: 10000 }).should('be.visible');
    
          // Setear la cookie con el payload de autenticación que contiene un único rol, por ejemplo "Enfermeria"
          cy.setCookie(
            'authPayload',
            JSON.stringify({
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Enfermeria",
            })
          );
    
          // Visitar la ruta donde se renderiza el componente para usuarios con un solo rol
          cy.visit('https://nuestra-senora-del-rosario-frontend.vercel.app/seleccionar-rol');
          // Recargar para que el componente lea la cookie actualizada
          cy.reload();
        });
    
        it('debería autoseleccionar el único rol y redirigir a /dashboard', () => {
          // En lugar de buscar el mensaje "Redirigiendo...", verificamos que la URL incluya /dashboard
          cy.url().should('include', '/dashboard', { timeout: 10000 });
        });
      });

    context('cuando el usuario tiene múltiples roles', () => {
      beforeEach(() => {
        // Simular el inicio de sesión visitando la URL principal
        cy.visit('https://nuestra-senora-del-rosario-frontend.vercel.app/');
        cy.get('input[placeholder="Cédula"]').type('121212121');
        cy.get('input[placeholder="Contraseña"]').type('Ozsu-2610');
        cy.get('button').contains('Iniciar sesión').click();
        cy.contains('Inicio de sesión exitoso', { timeout: 5000 }).should('be.visible');
  
        // Setear la cookie con el payload de autenticación que contiene dos roles, por ejemplo "Admin" y "Enfermeria"
        cy.setCookie(
          'authPayload',
          JSON.stringify({
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": ["Admin", "Enfermeria"],
          })
        );
  
        // Visitar la ruta donde se renderiza el componente para usuarios con múltiples roles
        cy.visit('https://nuestra-senora-del-rosario-frontend.vercel.app/seleccionar-rol');
        // Recargar para que el componente lea la cookie actualizada
        cy.reload();
      });
  
      it('debería mostrar la interfaz de selección de roles', () => {
        cy.contains('Seleccionar Rol').should('be.visible');
        cy.contains('Tienes múltiples roles. Por favor, selecciona uno para continuar.').should('be.visible');
        // Verificar que se muestren ambos roles como opciones
        cy.get('input[type="radio"][value="Admin"]').should('exist');
        cy.get('input[type="radio"][value="Enfermeria"]').should('exist');
      });
  
      it('debería tener el botón Confirmar deshabilitado hasta que se seleccione un rol', () => {
        cy.get('button').contains('Confirmar').should('be.disabled');
        // Al seleccionar una opción, el botón se habilita
        cy.get('input[type="radio"][value="Admin"]').click();
        cy.get('button').contains('Confirmar').should('not.be.disabled');
      });
  
      it('debería asignar el rol seleccionado y navegar a /dashboard al confirmar', () => {
        cy.get('input[type="radio"][value="Enfermeria"]').click();
        cy.get('button').contains('Confirmar').click();
        cy.url().should('include', '/dashboard');
      });
  
      it('debería cerrar la sesión y navegar a la página de inicio al cancelar', () => {
        cy.get('button').contains('Cancelar').click();
        cy.url().should('include', '/');
      });
    });
  });
  