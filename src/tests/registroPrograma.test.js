// tests/registroPrograma.test.js
const request = require('supertest');
const app = require('../dominio/models/server.models');

describe('POST /api/programa/:idColaborador/crearPrograma', () => {
  let token;

  beforeAll(async () => {
    // Autenticación de un usuario de prueba con rol 'PROFESIONAL DE PROYECTOS'
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'Stepha_ps2024',
        password: 'Stepha_p123$',
      });

    token = loginResponse.body.token;
  });

  it('Debe registrar un nuevo programa correctamente', async () => {
    const idColaborador = 'bba0beb3-0bb9-4f3a-bbf9-7487fdb87fb7'; // Reemplaza con un ID de colaborador válido

    const nuevoPrograma = {
      nombrePrograma: 'DIGITAL9',
      informacion: {
        PRESUPUESTO: '25000000',
        ALCANCE: 'REGIONAL',
      },
    };

    const response = await request(app)
      .post(`/api/programa/${idColaborador}/crearPrograma`)
      .set('Authorization', `Bearer ${token}`)
      .send(nuevoPrograma);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('msg', 'Programa creado correctamente');
    expect(response.body).toHaveProperty('programa');
    expect(response.body.programa).toHaveProperty('id');
    expect(response.body.programa).toHaveProperty('nombrePrograma', 'DIGITAL9');
    // Agrega más expectativas según los campos que esperas en la respuesta
  });
});

