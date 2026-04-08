import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create demo user (id=1 is hardcoded in the frontend)
  await prisma.user.upsert({
    where: { email: 'demo@concert.app' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@concert.app',
    },
  });

  console.log('Seed complete: demo user created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
