import request from 'supertest';
import { prisma } from '@__tests__/test-utils/prisma-client';
import {
  signupUser,
  VALID_EMAIL,
  VALID_PW,
} from '@__tests__/test-utils/user-test-utils';
import api from '../api';

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('/POST /authentication/login', () => {
  const ENDPOINT = '/authentication/login';

  test('Given an existing user with valid password, generate a JWT', async () => {
    await signupUser();

    const response = await request(api)
      .post(ENDPOINT)
      .send({ email: VALID_EMAIL, password: VALID_PW });

    expect(response.status).toEqual(200);
    expect(response.body.accessToken).toBeDefined();
  });

  test('Given a non existing user, throw an error', async () => {
    const response = await request(api).post(ENDPOINT).send({
      email: 'non-existing-email@email.com',
      password: 'some-random-pw',
    });

    expect(response.status).toEqual(500);
    expect(response.body).toMatchObject({ error: 'INVALID_CREDENTIALS' });
    expect(response.body.accessToken).not.toBeDefined();
  });

  test('Given a not valid password, throw an error', async () => {
    await signupUser();

    const response = await request(api)
      .post(ENDPOINT)
      .send({ email: VALID_EMAIL, password: 'not-matching-pw' });

    expect(response.status).toEqual(500);
    expect(response.body).toMatchObject({ error: 'INVALID_CREDENTIALS' });

    expect(response.body.accessToken).not.toBeDefined();
  });

  test('If email is not provided, throw an error', async () => {
    const response = await request(api)
      .post(ENDPOINT)
      .send({ password: 'not-matching-pw' });

    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      error: 'EMAIL_AND_PASSWORD_MUST_BE_PROVIDED',
    });

    expect(response.body.accessToken).not.toBeDefined();
  });

  test('If password is not provided, throw an error', async () => {
    const response = await request(api)
      .post(ENDPOINT)
      .send({ email: VALID_EMAIL });

    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      error: 'EMAIL_AND_PASSWORD_MUST_BE_PROVIDED',
    });

    expect(response.body.accessToken).not.toBeDefined();
  });
});
