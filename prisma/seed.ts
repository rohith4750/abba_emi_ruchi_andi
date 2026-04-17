import { PrismaClient } from "@prisma/client"
import "dotenv/config"

const prisma = new PrismaClient()

async function main() {
  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@abbami.com' },
    update: {},
    create: {
      email: 'admin@abbami.com',
      name: 'Admin User',
      password: 'admin123', // In a real app, use hashed passwords
      role: 'ADMIN',
    },
  })

  // 2. Create Categories
  const categories = [
    {
      name: 'Heritage Pickles',
      slug: 'heritage-pickles',
      description: 'Authentic, sun-dried Telugu pickles made with traditional recipes.',
    },
    {
      name: 'Authentic Podis',
      slug: 'authentic-podis',
      description: 'Hand-pounded spice powders that bring the taste of home to your plate.',
    },
    {
      name: 'Special Powders',
      slug: 'special-powders',
      description: 'Expertly blended masalas and powders for perfect curries and rasams.',
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }

  // 3. Create Sample Products
  const heritagePickles = await prisma.category.findUnique({ where: { slug: 'heritage-pickles' } })
  const authenticPodis = await prisma.category.findUnique({ where: { slug: 'authentic-podis' } })

  if (heritagePickles && authenticPodis) {
    const products = [
      {
        name: 'Avakaya Pickle',
        slug: 'avakaya-pickle',
        description: 'The King of Pickles - Spicy Mango Pickle made with premium mustard oil.',
        price: 450.00,
        stock: 50,
        categoryId: heritagePickles.id,
        images: ['https://images.unsplash.com/photo-1589135233689-ba3719001157?q=80&w=800'],
      },
      {
        name: 'Gongura Pickle',
        slug: 'gongura-pickle',
        description: 'Tangy and spicy Roselle leaves pickle - a Telugu household staple.',
        price: 380.00,
        stock: 30,
        categoryId: heritagePickles.id,
        images: ['https://images.unsplash.com/photo-1589135233689-ba3719001157?q=80&w=800'],
      },
      {
        name: 'Kandi Podi',
        slug: 'kandi-podi',
        description: 'Roasted lentils powder - perfect with hot rice and ghee.',
        price: 250.00,
        stock: 100,
        categoryId: authenticPodis.id,
        images: ['https://images.unsplash.com/photo-1589135233689-ba3719001157?q=80&w=800'],
      },
    ]

    for (const prod of products) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: prod,
        create: prod,
      })
    }
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
