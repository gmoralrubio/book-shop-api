import request from 'supertest';
import api from '../api';
import { prisma } from './test-utils/prisma-client';
import { VALID_EMAIL, VALID_PW } from '@__tests__/test-utils/user-test-utils';

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /authentication/signup', () => {
  const ENDPOINT = '/authentication/signup';

  test('Given valid data a new user is created', async () => {
    const response = await request(api).post(ENDPOINT).send({
      email: VALID_EMAIL,
      password: VALID_PW,
    });

    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({
      message: 'USER_CREATED_SUCCESSFULLY',
    });

    const createdUser = await prisma.user.findUnique({
      where: {
        email: VALID_EMAIL,
      },
    });
    expect(createdUser).not.toBeNull();
  });

  test('Given a pasword not strong enough, an error is thrown', async () => {
    const response = await request(api).post(ENDPOINT).send({
      email: VALID_EMAIL,
      password: 'corta',
    });
    expect(response.status).toEqual(500);
    expect(response.body).toEqual({ error: 'INVALID_CREDENTIALS' });
  });

  test('Given an invalid email, an error is thrown', async () => {
    const response = await request(api).post(ENDPOINT).send({
      email: 'invalidemail.com',
      password: VALID_PW,
    });
    expect(response.status).toEqual(500);
    expect(response.body).toEqual({ error: 'INVALID_CREDENTIALS' });
  });

  test('When email is not given, an error is thrown', async () => {
    const response = await request(api).post(ENDPOINT).send({
      password: VALID_PW,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      error: 'EMAIL_AND_PASSWORD_MUST_BE_PROVIDED',
    });
  });

  test('Given an existing email, an error is thrown', async () => {
    const response1 = await request(api).post(ENDPOINT).send({
      email: VALID_EMAIL,
      password: VALID_PW,
    });

    expect(response1.status).toEqual(201);

    const response2 = await request(api).post(ENDPOINT).send({
      email: VALID_EMAIL,
      password: VALID_PW,
    });

    expect(response2.status).toEqual(500);
    expect(response2.body).toEqual({ error: 'INVALID_CREDENTIALS' });
  });
});
