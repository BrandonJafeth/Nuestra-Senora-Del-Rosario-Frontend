/// <reference types="cypress" />

describe('Flujo completo de Solicitud de Ingreso', () => {
  // Generamos datos únicos para identificar la solicitud fácilmente
  const timestamp = new Date().getTime();
  const nombre = `Test${timestamp}`;
  const apellido = `Cypress${timestamp}`;
  const cedula = `${timestamp}`.substring(0, 9);
  const telefono = `8${timestamp}`.substring(0, 8);

  // Test de validación de campos
  it('Debería validar los campos del formulario correctamente', () => {
    cy.visit('https://www.senoradelrosario.tech/solicitud-formulario');
    
    // Intentar enviar el formulario vacío para verificar validaciones
    cy.get('button').contains('Enviar Solicitud').click();
    cy.contains('El nombre es obligatorio').should('be.visible');
    cy.contains('El primer apellido es obligatorio').should('be.visible');
    cy.contains('El segundo apellido es obligatorio').should('be.visible');
    cy.contains('La edad es obligatoria').should('be.visible');
    cy.contains('La cédula es obligatoria').should('be.visible');
    cy.contains('Domicilio Requerido').should('be.visible');
    
    // Probar validación de edad
    cy.get('input[name="age_AP"]').type('50');
    cy.get('button').contains('Enviar Solicitud').click();
    cy.contains('La edad debe ser mayor o igual a 65 años').should('be.visible');
    cy.get('input[name="age_AP"]').clear().type('65');
    
    // Probar validación de cédula
    cy.get('input[name="cedula_AP"]').type('12345');
    cy.get('button').contains('Enviar Solicitud').click();
    cy.contains('La cédula debe tener exactamente 9 caracteres').should('be.visible');
    cy.get('input[name="cedula_AP"]').clear().type('12345678A');
    cy.get('button').contains('Enviar Solicitud').click();
    cy.contains('La cédula solo debe contener números').should('be.visible');
    cy.get('input[name="cedula_AP"]').clear().type(cedula);
    
    // Probar validación de teléfono del encargado
    cy.get('input[name="guardianPhone"]').type('123ABC');
    cy.get('button').contains('Enviar Solicitud').click();
    cy.contains('El teléfono solo debe contener números').should('be.visible');
    cy.get('input[name="guardianPhone"]').clear().type(telefono);
    
    // Probar validación de correo electrónico
    cy.get('input[name="guardianEmail"]').type('correo_invalido');
    cy.get('button').contains('Enviar Solicitud').click();
    cy.contains('Correo inválido').should('be.visible');
    cy.get('input[name="guardianEmail"]').clear().type(`test${timestamp}@example.com`);
  });

  it('Debería completar el formulario y enviar la solicitud exitosamente', () => {
    // Paso 1: Crear la solicitud en el sitio público
    cy.visit('https://www.senoradelrosario.tech/solicitud-formulario');
    
    // Completar el formulario de solicitud
    cy.get('input[name="name_AP"]').type(nombre);
    cy.get('input[name="lastName1_AP"]').type(apellido);
    cy.get('input[name="lastName2_AP"]').type('Prueba');
    cy.get('input[name="cedula_AP"]').type(cedula);
    cy.get('input[name="age_AP"]').type('65'); // La edad debe ser mayor o igual a 65 años
    cy.get('input[name="location_AP"]').type('Alajuela, Costa Rica');
    
    // Datos del encargado
    cy.get('input[name="guardianName"]').type('Encargado');
    cy.get('input[name="guardianLastName1"]').type('De');
    cy.get('input[name="guardianLastName2"]').type('Prueba');
    cy.get('input[name="guardianCedula"]').type(`${timestamp}`.substring(0, 9));
    cy.get('input[name="guardianPhone"]').type(telefono);
    cy.get('input[name="guardianEmail"]').type(`test${timestamp}@example.com`);
    
    // Enviar el formulario
    cy.get('button').contains('Enviar Solicitud').click();
    
    // Verificar modal de éxito con el mensaje correcto
    cy.contains('Solicitud Enviada', { timeout: 10000 }).should('be.visible');
    cy.contains('Su solicitud ha sido enviada con éxito, pronto nos comunicaremos con usted').should('be.visible');
    cy.contains('Cerrar').click();
  });
  
  // Separamos la prueba en dos partes para evitar el problema de cy.origin()
  it('Debería poder verificar la solicitud en el panel administrativo', () => {
    // Acceder directamente al panel administrativo
    cy.visit('https://www.nuestrasenora.me/');
    
    // Iniciar sesión con el selector correcto
    cy.get('input[placeholder="Cédula"]').type('1234');
    cy.get('input[placeholder="Contraseña"]').type('SA123');
    cy.get('button').contains('Iniciar sesión').click();
    
    // Verificar que el inicio de sesión fue exitoso
    cy.contains('Inicio de sesión exitoso', { timeout: 5000 }).should('be.visible');
    
    // Navegar a la página de solicitudes de ingreso
    cy.visit('https://www.nuestrasenora.me/dashboard/solicitudes/ingreso');
    
    // Esperar a que la página cargue completamente
    cy.contains('Solicitudes de ingreso', { timeout: 10000 }).should('be.visible');
    
    // Verificar usando el filtro de "Pendiente"
    cy.contains('Pendiente').click();
    
    // Esperar a que se aplique el filtro
    cy.wait(1000);
    
    // Solo verificar que hay solicitudes pendientes
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });
});
