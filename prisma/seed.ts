import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import "dotenv/config"

const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
        price: 150.00, // Base price for 250g
        stock: 50,
        categoryId: heritagePickles.id,
        sizes: {
          create: [
            { weight: '250g', price: 150.00, stock: 20 },
            { weight: '500g', price: 280.00, stock: 20 },
            { weight: '1kg', price: 550.00, stock: 10 },
          ]
        }
      },
      {
        name: 'Gongura Pickle',
        slug: 'gongura-pickle',
        description: 'Tangy and spicy Roselle leaves pickle - a Telugu household staple.',
        price: 120.00,
        stock: 30,
        categoryId: heritagePickles.id,
        sizes: {
          create: [
            { weight: '250g', price: 120.00, stock: 10 },
            { weight: '500g', price: 230.00, stock: 15 },
            { weight: '1kg', price: 450.00, stock: 5 },
          ]
        }
      },
      {
        name: 'Tomato Pickle',
        slug: 'tomato-pickle',
        description: 'Traditional spicy tomato pickle with a hint of garlic.',
        price: 100.00,
        stock: 40,
        categoryId: heritagePickles.id,
        sizes: {
          create: [
            { weight: '250g', price: 100.00, stock: 15 },
            { weight: '500g', price: 190.00, stock: 15 },
            { weight: '1kg', price: 370.00, stock: 10 },
          ]
        }
      },
      {
        name: 'Kandi Podi',
        slug: 'kandi-podi',
        description: 'Roasted lentils powder - perfect with hot rice and ghee.',
        price: 80.00,
        stock: 100,
        categoryId: authenticPodis.id,
        sizes: {
          create: [
            { weight: '250g', price: 80.00, stock: 40 },
            { weight: '500g', price: 150.00, stock: 40 },
            { weight: '1kg', price: 280.00, stock: 20 },
          ]
        }
      },
    ]

    for (const prod of products) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          ...prod,
          sizes: undefined // Don't update sizes via upsert like this
        },
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
