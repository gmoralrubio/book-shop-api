import request from 'supertest';
import prismaClient from '@infraestructure/shared/prisma-client';

import { loginUser, signupUser } from '@__tests__/test-utils/user-test-utils';
import api from '../api';
import { environmentService } from '@infraestructure/EnvironmentService';

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

describe('/POST /books', () => {
  const ENDPOINT = '/books';
  const VALID_BOOK = {
    title: 'Test title',
    description:
      'Test description, test description test description test description',
    price: 20,
    author: 'Test author',
  };

  test('Given valid data a new book is created', async () => {
    await signupUser();
    const token = await loginUser();

    const response = await request(api)
      .post(ENDPOINT)
      .auth(token, { type: 'bearer' })
      .send(VALID_BOOK);

    expect(response.status).toEqual(201);

    expect(response.body.title).toEqual(VALID_BOOK.title);
  });
});
