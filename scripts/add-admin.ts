import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'rohithtelidevara@gmail.com' },
    update: {},
    create: {
      email: 'rohithtelidevara@gmail.com',
      name: 'rohith',
      password: 'admin123',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created/verified:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Error creating user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
