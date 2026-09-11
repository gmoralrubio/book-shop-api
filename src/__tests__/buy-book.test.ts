import { createBook } from '@__tests__/test-utils/book-test-utils';
import prismaClient from '@infrastructure/shared/prisma-client';
import { loginUser, signupUser } from '@__tests__/test-utils/user-test-utils';
import api from '../api';
import request from 'supertest';
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

const testUserA = {
  email: 'valid.email.a@test.com',
  password: 'validPassword1A!',
};
const testUserB = {
  email: 'valid.email.b@test.com',
  password: 'validPassword1B!',
};

describe('POST /books/:id/buy', () => {
  test('Given valid data, an authenticated user can buy another users book', async () => {
    await signupUser(testUserA);
    const tokenUserA = await loginUser(testUserA);
    await signupUser(testUserB);
    const tokenUserB = await loginUser(testUserB);

    const newBook = await createBook(tokenUserA);

    expect(newBook.status).toEqual(201);

    const id = newBook.body.id;
    const response = await request(api)
      .post(`/books/${id}/buy`)
      .auth(tokenUserB, { type: 'bearer' });

    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual('SOLD');
  });

  test('An error with status code 404 is returned if the book doesnt exist', async () => {
    await signupUser(testUserA);
    const token = await loginUser(testUserA);
    const nonExistingId = '999';

    const response = await request(api)
      .post(`/books/${nonExistingId}/buy`)
      .auth(token, { type: 'bearer' });

    expect(response.status).toEqual(404);
    expect(response.body.error).toEqual(
      `Entity Book not found with id ${nonExistingId}`
    );
  });

  test('An error with status code 400 is returned if the id is not valid', async () => {
    await signupUser(testUserA);
    const token = await loginUser(testUserA);
    const invalidId = 'aaa';

    const response = await request(api)
      .post(`/books/${invalidId}/buy`)
      .auth(token, { type: 'bearer' });

    expect(response.status).toEqual(400);
    expect(response.body.error).toEqual('Invalid id. Must be a number');
  });

  test('An error with status code 409 is returned if the book status is "SOLD"', async () => {
    await signupUser(testUserA);
    const tokenUserA = await loginUser(testUserA);
    await signupUser(testUserB);
    const tokenUserB = await loginUser(testUserB);

    const newBook = await createBook(tokenUserA);

    expect(newBook.status).toEqual(201);

    const id = newBook.body.id;
    await request(api)
      .post(`/books/${id}/buy`)
      .auth(tokenUserB, { type: 'bearer' });

    const response = await request(api)
      .post(`/books/${id}/buy`)
      .auth(tokenUserB, { type: 'bearer' });

    expect(response.status).toEqual(409);
    expect(response.body.error).toEqual(
      'Users cannot buy a book with SOLD status'
    );
  });

  test('An error with status code 409 is returned if the user is the book owner', async () => {
    await signupUser(testUserA);
    const token = await loginUser(testUserA);
    const newBook = await createBook(token);

    const id = newBook.body.id;

    const response = await request(api)
      .post(`/books/${id}/buy`)
      .auth(token, { type: 'bearer' });

    expect(response.status).toEqual(409);
    expect(response.body.error).toEqual('Users cannot buy their own books');
  });
});
