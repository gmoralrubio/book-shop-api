import request from 'supertest';
import prismaClient from '@infraestructure/shared/prisma-client';

import { loginUser, signupUser } from '@__tests__/test-utils/user-test-utils';
import api from '../api';
import { TEST_BOOK } from '@__tests__/test-utils/book-test-utils';
import { environmentService } from '@infraestructure/shared/services/EnvironmentService';

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

  test('Given valid data a new book is created', async () => {
    await signupUser();
    const token = await loginUser();

    const response = await request(api)
      .post(ENDPOINT)
      .auth(token, { type: 'bearer' })
      .send(TEST_BOOK);

    expect(response.status).toEqual(201);

    expect(response.body.title).toEqual(TEST_BOOK.title);
  });
});
