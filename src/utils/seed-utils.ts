import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import prismaClient from '@infrastructure/shared/prisma-client';

export async function seedDB() {
  const ids = await seedUsers();
  await seedBooks(10, ids);
}
async function seedUsers() {
  const salt = await bcrypt.genSalt(10);

  const [userA, userB] = await Promise.all([
    prismaClient.user.upsert({
      where: { email: 'john.doe@email.com' },
      update: {},
      create: {
        email: 'john.doe@email.com',
        password: await bcrypt.hash('validPassword123!', salt),
      },
    }),
    prismaClient.user.upsert({
      where: { email: 'admin@email.com' },
      update: {},
      create: {
        email: 'admin@email.com',
        password: await bcrypt.hash('validPassword123!', salt),
      },
    }),
  ]);

  return [userA.id, userB.id];
}

async function seedBooks(numBooks: number, ids: number[]) {
  for (let i = 1; i <= numBooks; i++) {
    const status = faker.helpers.arrayElement(['PUBLISHED', 'SOLD']);
    const soldAt = status === 'PUBLISHED' ? null : new Date();
    await prismaClient.book.upsert({
      where: { id: i },
      update: {},
      create: {
        id: i,
        title: faker.book.title(),
        description: faker.lorem.words(10),
        price: faker.number.float({ min: 1, max: 50, fractionDigits: 2 }),
        author: faker.book.author(),
        ownerId: faker.helpers.arrayElement([...ids]),
        status,
        soldAt,
      },
    });
  }
}
