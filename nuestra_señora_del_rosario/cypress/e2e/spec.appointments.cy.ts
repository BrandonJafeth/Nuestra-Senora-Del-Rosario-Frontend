/// <reference types="cypress" />
/// <reference types="mocha" />

describe('Cronograma de Citas - Datos Predefinidos', () => {
  beforeEach(() => {
    // Cargar datos de fixtures en el localStorage.
    cy.fixture('appointments').then((appointments) => {
      window.localStorage.setItem('appointments', JSON.stringify(appointments));
    });
    cy.fixture('notifications').then((notifications) => {
      window.localStorage.setItem('notifications', JSON.stringify(notifications));
    });
    cy.fixture('notes').then((notes) => {
      window.localStorage.setItem('notes', JSON.stringify(notes));
    });

    // Visitar la URL principal e iniciar sesión.
    cy.visit('http://localhost:5173/');
    cy.get('input[placeholder="Cédula"]').type('1234');
    cy.get('input[placeholder="Contraseña"]').type('SA123');
    cy.get('button').contains('Iniciar sesión').click();
    cy.contains('Inicio de sesión exitoso', { timeout: 5000 }).should('be.visible');

    // Navegar a la página del cronograma inyectando la cookie antes de que se cargue la app.
    cy.visit('http://localhost:5173/dashboard/cronograma-citas', {
      onBeforeLoad(win: any) {
        const window = win as Window;
        window.document.cookie = `authPayload=${JSON.stringify({
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "SuperAdmin"
        })}; path=/;`;
      }
    });
  });

  it('debería mostrar el calendario y los datos de citas cargados desde fixtures', () => {
    cy.contains('Citas programadas').should('be.visible');
  });

  it('debería permitir navegar en el toolbar del calendario', () => {
    cy.get('.rbc-toolbar').should('contain', new RegExp('(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)'));
    cy.contains('Hoy').click();
    cy.contains('Anterior').click();
    cy.contains('Siguiente').click();
  });

  it('debería mostrar los botones "Agregar Cita" y "Agregar Nota" para usuarios con rol Enfermeria o SuperAdmin', () => {
    // Ahora, al cargar la página, la cookie ya está inyectada y useAuth debería retornar el rol adecuado.
    cy.contains('Agregar Cita').should('be.visible');
    cy.contains('Agregar Nota').should('be.visible');
  });

  it('debería abrir el modal de citas diarias al seleccionar un evento del calendario', () => {
    // Suponiendo que los eventos se renderizan con la clase "custom-event-container"
    cy.get('.custom-event-container').first().click();
    cy.get('.ReactModal__Content').should('contain', 'Citas del');
    // Verifica que se muestre un dato de la cita (ejemplo, "Brandin Carrillo Alvarez")
    cy.contains('Brandin Carrillo Alvarez').should('be.visible');

    cy.get('button.flex.items-center.w-full')
      .contains('Cerrar')
      .first()
      .click({ force: true });
  });
});
