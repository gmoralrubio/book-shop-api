import api from '../../api';
import request from 'supertest';

export const TEST_BOOK = {
  title: 'Valid test title',
  description:
    'Valid test description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  price: 9.99,
  author: 'Valid test author',
};

export async function createBook(
  token: string,
  overrides: {
    title?: string;
    description?: string;
    price?: number;
    author?: string;
  } = {}
) {
  const response = await request(api)
    .post('/books')
    .auth(token, { type: 'bearer' })
    .send({
      title: TEST_BOOK.title,
      description: TEST_BOOK.description,
      price: TEST_BOOK.price,
      author: TEST_BOOK.author,
      ...overrides,
    });

  return response;
}
