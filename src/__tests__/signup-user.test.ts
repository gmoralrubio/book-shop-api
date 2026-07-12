import request from 'supertest';
import api from '../api';
import prismaClient from '@infrastructure/shared/prisma-client';
import { VALID_EMAIL, VALID_PW } from '@__tests__/test-utils/user-test-utils';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';

beforeAll(() => {
  environmentService.load();
});

beforeEach(async () => {
  await prismaClient.book.deleteMany();
  await prismaClient.user.deleteMany();
});

afterAll(async () => {
  await prismaClient.$disconnect();
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
      message: 'User created successfully',
    });

    const createdUser = await prismaClient.user.findUnique({
      where: {
        email: VALID_EMAIL,
      },
    });
    expect(createdUser).not.toBeNull();
  });

  test('Given a invalid password, an error is thrown', async () => {
    const response = await request(api).post(ENDPOINT).send({
      email: VALID_EMAIL,
      password: 'corta',
    });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      error: 'Password does not comply with validation rules',
    });
  });

  test('Given an invalid email, an error is thrown', async () => {
    const response = await request(api).post(ENDPOINT).send({
      email: 'invalidemail.com',
      password: VALID_PW,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      error: 'Email does not comply with validation rules',
    });
  });

  test('When password is not given, an error is thrown', async () => {
    const response = await request(api).post(ENDPOINT).send({
      email: VALID_EMAIL,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      error: 'Password is required',
    });
  });

  test('When email is not given, an error is thrown', async () => {
    const response = await request(api).post(ENDPOINT).send({
      password: VALID_PW,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      error: 'Email is required',
    });
  });

  test('Given an existing email, an error is thrown', async () => {
    const response1 = await request(api).post(ENDPOINT).send({
      email: VALID_EMAIL,
      password: VALID_PW,
    });

    expect(response1.status).toEqual(201);
    expect(response1.body).toMatchObject({
      message: 'User created successfully',
    });

    const response2 = await request(api).post(ENDPOINT).send({
      email: VALID_EMAIL,
      password: VALID_PW,
    });

    expect(response2.status).toEqual(409);
    expect(response2.body).toEqual({
      error: 'An user with same email already exists',
    });
  });
});
