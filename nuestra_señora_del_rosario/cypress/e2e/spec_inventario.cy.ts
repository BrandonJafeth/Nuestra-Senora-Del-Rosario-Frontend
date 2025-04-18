/// <reference types="cypress" />

describe('Pruebas de Inventario', () => {
  beforeEach(() => {
    // Realizar login antes de cada prueba
    cy.visit('https://www.nuestrasenora.me/login');
    cy.get('[data-test="email"]').type('admin@example.com');
    cy.get('[data-test="password"]').type('password123');
    cy.get('[data-test="login-button"]').click();
    
    // Navegar a la página de inventario
    cy.visit('https://www.nuestrasenora.me/dashboard/inventario/lista-productos');
    cy.url().should('include', '/dashboard/inventario/lista-productos');
  });

  it('Debe poder registrar un nuevo producto', () => {
    // Hacer clic en el botón para agregar nuevo producto
    cy.get('[data-test="agregar-producto"]').click();
    
    // Llenar el formulario del producto
    const nombreProducto = `Producto Test ${Date.now()}`;
    cy.get('[data-test="nombre-producto"]').type(nombreProducto);
    cy.get('[data-test="descripcion-producto"]').type('Descripción de prueba');
    cy.get('[data-test="cantidad-producto"]').type('100');
    cy.get('[data-test="unidad-medida"]').select('Unidades');
    cy.get('[data-test="precio-producto"]').type('15.50');
    cy.get('[data-test="categoria-producto"]').select('Medicamentos');
    
    // Guardar el producto
    cy.get('[data-test="guardar-producto"]').click();
    
    // Verificar que el producto aparezca en la lista
    cy.contains(nombreProducto).should('be.visible');
  });

  it('Debe poder egresar unidades de un producto', () => {
    // Buscar un producto existente
    const productoExistente = 'Producto Test';
    cy.get('[data-test="buscador-productos"]').type(productoExistente);
    
    // Hacer clic en el botón de egreso
    cy.contains(productoExistente)
      .parents('tr')
      .find('[data-test="egreso-producto"]')
      .click();
    
    // Llenar el formulario de egreso
    cy.get('[data-test="cantidad-egreso"]').type('10');
    cy.get('[data-test="motivo-egreso"]').select('Venta');
    cy.get('[data-test="confirmar-egreso"]').click();
    
    // Verificar que el stock se actualice correctamente
    cy.contains(productoExistente)
      .parents('tr')
      .find('[data-test="stock-producto"]')
      .invoke('text')
      .then((stockText) => {
        const stockActual = parseInt(stockText.trim(), 10);
        expect(stockActual).to.eq(90); // Asumiendo que tenía 100 unidades inicialmente
      });
  });

  it('Debe calcular correctamente el stock después de múltiples operaciones', () => {
    // Buscar un producto para operaciones múltiples
    const productoMultiple = 'Producto Múltiple';
    
    // Primero agregamos este producto si no existe
    cy.get('[data-test="agregar-producto"]').click();
    cy.get('[data-test="nombre-producto"]').type(productoMultiple);
    cy.get('[data-test="descripcion-producto"]').type('Para pruebas múltiples');
    cy.get('[data-test="cantidad-producto"]').type('200');
    cy.get('[data-test="unidad-medida"]').select('Gramos');
    cy.get('[data-test="precio-producto"]').type('5.75');
    cy.get('[data-test="categoria-producto"]').select('Insumos');
    cy.get('[data-test="guardar-producto"]').click();
    
    // Realizar primer egreso (50 gramos)
    cy.get('[data-test="buscador-productos"]').clear().type(productoMultiple);
    cy.contains(productoMultiple)
      .parents('tr')
      .find('[data-test="egreso-producto"]')
      .click();
    cy.get('[data-test="cantidad-egreso"]').type('50');
    cy.get('[data-test="motivo-egreso"]').select('Uso interno');
    cy.get('[data-test="confirmar-egreso"]').click();
    
    // Realizar segundo egreso (30 gramos)
    cy.get('[data-test="buscador-productos"]').clear().type(productoMultiple);
    cy.contains(productoMultiple)
      .parents('tr')
      .find('[data-test="egreso-producto"]')
      .click();
    cy.get('[data-test="cantidad-egreso"]').type('30');
    cy.get('[data-test="motivo-egreso"]').select('Venta');
    cy.get('[data-test="confirmar-egreso"]').click();
    
    // Verificar el stock final (debe ser 120 gramos)
    cy.get('[data-test="buscador-productos"]').clear().type(productoMultiple);
    cy.contains(productoMultiple)
      .parents('tr')
      .find('[data-test="stock-producto"]')
      .invoke('text')
      .then((stockText) => {
        const stockFinal = parseInt(stockText.trim(), 10);
        expect(stockFinal).to.eq(120); // 200 - 50 - 30 = 120
      });
  });

  it('Flujo completo: agregar producto de Oficina, egreso, ingreso y conversión de Leche a cajas', () => {
    // Seleccionar categoría Oficina
    cy.get('#category-select').select('Oficina');

    // Agregar producto de oficina
    const nombreOficina = `Oficina Test ${Date.now()}`;
    cy.get('[data-test="agregar-producto"]').click();
    cy.get('[data-test="nombre-producto"]').type(nombreOficina);
    cy.get('[data-test="descripcion-producto"]').type('Producto de oficina para pruebas');
    cy.get('[data-test="cantidad-producto"]').type('50');
    cy.get('[data-test="unidad-medida"]').select('Unidades');
    cy.get('[data-test="precio-producto"]').type('10.00');
    cy.get('[data-test="categoria-producto"]').select('Oficina');
    cy.get('[data-test="guardar-producto"]').click();
    cy.contains(nombreOficina).should('be.visible');

    // Egreso de 5 unidades
    cy.get('[data-test="buscador-productos"]').clear().type(nombreOficina);
    cy.contains(nombreOficina)
      .parents('tr')
      .find('[data-test="egreso-producto"]')
      .click();
    cy.get('[data-test="cantidad-egreso"]').type('5');
    cy.get('[data-test="motivo-egreso"]').select('Uso interno');
    cy.get('[data-test="confirmar-egreso"]').click();
    cy.contains(nombreOficina)
      .parents('tr')
      .find('[data-test="stock-producto"]')
      .invoke('text')
      .then((t) => {
        const stock = parseInt(t.trim(), 10);
        expect(stock).to.eq(45);
      });

    // Ingreso de 10 unidades con Movimiento
    cy.contains(nombreOficina)
      .parents('tr')
      .find('button')
      .contains('Movimiento')
      .click();
    cy.get('input#quantity').clear().type('10');
    cy.get('button').contains('Agregar').click();
    cy.contains(nombreOficina)
      .parents('tr')
      .find('[data-test="stock-producto"]')
      .invoke('text')
      .then((t) => {
        const stock = parseInt(t.trim(), 10);
        expect(stock).to.eq(55);
      });

    // Conversión de Leche a cajas
    cy.get('#category-select').select('Alimentos');
    cy.contains('Leche')
      .parents('tr')
      .find('button')
      .contains('Convertir')
      .click();
    cy.get('#conversionUnit').select('Caja');
    cy.get('button').contains('Confirmar').click();
    cy.contains('Leche')
      .parents('tr')
      .find('td')
      .eq(1)
      .should('contain', 'Caja');
  });
});
