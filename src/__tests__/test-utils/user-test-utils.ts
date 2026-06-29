import api from '../../api';
import request from 'supertest';

export const VALID_EMAIL = 'some.email@email.com';
export const VALID_PW = 'ValidPassword1!';

// Crea un usuario a través de la API.
// Lanza un error si el registro falla, para evitar que el resto del test
// continúe con un usuario que no existe realmente.
export async function signupUser(
  overrides: {
    email?: string;
    password?: string;
  } = {}
) {
  const response = await request(api)
    .post('/authentication/signup')
    .send({
      email: VALID_EMAIL,
      password: VALID_PW,
      ...overrides,
    });
  if (response.status !== 201) {
    throw new Error(
      `createUser falló con status ${response.status}: ${JSON.stringify(response.body)}`
    );
  }
}

export async function loginUser(
  overrides: {
    email?: string;
    password?: string;
  } = {}
) {
  const response = await request(api)
    .post('/authentication/signin')
    .send({
      email: VALID_EMAIL,
      password: VALID_PW,
      ...overrides,
    });
  return response.body.accessToken;
}
