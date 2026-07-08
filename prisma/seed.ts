import { seedDB } from '../src/utils/seed-utils';
import prismaClient from '../src/infraestructure/shared/prisma-client';

seedDB()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
