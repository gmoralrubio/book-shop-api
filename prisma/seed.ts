import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await seedUsers();
  await seedBooks(10);
}

async function seedUsers() {
  const salt = await bcrypt.genSalt(10);

  await prisma.user.upsert({
    where: { email: 'john.doe@email.com' },
    update: {},
    create: {
      email: 'john.doe@email.com',
      password: await bcrypt.hash('validPassword123!', salt),
    },
  });
  await prisma.user.upsert({
    where: { email: 'admin@email.com' },
    update: {},
    create: {
      email: 'admin@email.com',
      password: await bcrypt.hash('validPassword123!', salt),
    },
  });
  console.log('Users seeded');
}

async function seedBooks(numBooks: number) {
  for (let i = 1; i <= numBooks; i++) {
    const status = faker.helpers.arrayElement(['PUBLISHED', 'SOLD']);
    const soldAt = status === 'PUBLISHED' ? null : new Date();
    await prisma.book.upsert({
      where: { id: i },
      update: {},
      create: {
        id: i,
        title: faker.book.title(),
        description: faker.lorem.words(10),
        price: faker.number.float({ min: 1, max: 50, fractionDigits: 2 }),
        author: faker.book.author(),
        ownerId: faker.helpers.arrayElement([1, 2]),
        status,
        soldAt,
      },
    });
  }
  console.log('Books seeded');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
