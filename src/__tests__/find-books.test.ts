import prismaClient from '@infraestructure/shared/prisma-client';
import { environmentService } from '@infraestructure/EnvironmentService';
import request from 'supertest';
import api from '../api';
import { seedDB } from '../utils/seed-utils';
import { signupUser, loginUser } from '@__tests__/test-utils/user-test-utils';
import { createBook } from '@__tests__/test-utils/book-test-utils';
import { Book } from '@domain/book/Book';

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

describe('GET /books', () => {
  const ENDPOINT = '/books';

  test('Endpoint responds with paginated results', async () => {
    await seedDB();

    const response = await request(api).get(ENDPOINT);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('limit');
    expect(response.body.meta).toHaveProperty('page');
    expect(response.body.meta).toHaveProperty('total');
  });

  test('Given a partial search param for an existing title it returns all matching books', async () => {
    await signupUser();
    const token = await loginUser();
    await createBook(token, {
      title: 'Harry Potter y la piedra filosofal',
    });
    await createBook(token, {
      title: 'Harry Potter y el cáliz de fuego',
    });

    const response = await request(api).get(`${ENDPOINT}?search=harr`);

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(2);
  });

  test('Given a partial search param for an existing author it returns all matching books', async () => {
    await signupUser();
    const token = await loginUser();
    await createBook(token, {
      author: 'J. K. Rowling',
    });
    await createBook(token, {
      author: 'J. K. Rowling',
    });

    const response = await request(api).get(`${ENDPOINT}?search=rowl`);

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(2);
  });

  test('Endpoint responds without books with SOLD status', async () => {
    await seedDB();

    const response = await request(api).get(ENDPOINT);
    const soldStatus = response.body.data.filter(
      (book: Book) => book.status === 'SOLD'
    );

    expect(response.status).toEqual(200);
    expect(soldStatus).toHaveLength(0);
  });
});
