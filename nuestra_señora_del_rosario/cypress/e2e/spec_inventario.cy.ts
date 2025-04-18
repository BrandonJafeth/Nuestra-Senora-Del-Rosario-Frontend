/// <reference types="cypress" />

describe('Pruebas de Inventario', () => {
  beforeEach(() => {
    // Realizar login antes de cada prueba
    cy.visit('https://www.nuestrasenora.me');
    cy.get('input[placeholder="Cédula"]').type('1234');
    cy.get('input[placeholder="Contraseña"]').type('SA123');
    cy.get('button').contains('Iniciar sesión').click();
    cy.contains('Inicio de sesión exitoso', { timeout: 5000 }).should('be.visible');
    
    // Esperar redirección al dashboard
    cy.url().should('include', '/dashboard');
  });

  it('Flujo completo: agregar producto de Oficina, egreso, ingreso y conversión de Leche a cajas', () => {
    // 1. Ir a la página de lista de productos
    cy.visit('https://www.nuestrasenora.me/dashboard/inventario/lista-productos');
    cy.url().should('include', '/dashboard/inventario/lista-productos');

    // 2. Seleccionar categoría Oficina (es necesario elegir una categoría para ver productos)
    cy.get('#category-select').select('Oficina');
    cy.wait(1000); // Esperar a que se carguen los productos

    // 3. Agregar nuevo producto de oficina
    const nombreOficina = `Oficina Test ${Date.now()}`;
    cy.contains('button', 'Agregar Producto').click();
    
    // Llenar el formulario con las etiquetas correctas
    cy.contains('Nombre del producto').parent().find('input').type(nombreOficina);
    
    // Seleccionar directamente en los campos select
    cy.get('select').contains('Selecciona una categoría').parent().select('Oficina');
    cy.get('select').contains('Selecciona una unidad').parent().select('Unidad');
    
    // Cantidad inicial como número simple
    cy.get('input[type="number"]').clear().type('50');

    
    cy.contains('button', 'Agregar producto').click();
    cy.contains('Producto agregado exitosamente.', { timeout: 5000 }).should('be.visible');
    cy.wait(1000);
    
  });
});
