import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ DATABASE_URL is not defined. Database features will be unavailable.");
}

const prismaClientSingleton = () => {
  try {
    // If no connection string is provided (e.g. during Vercel build time), 
    // we return a proxy/mock or let it fail more gracefully without crashing the build
    if (!connectionString) {
      console.warn("⚠️ Providing dummy database URL for build-time compatibility.");
      return new PrismaClient({
        datasources: {
          db: { url: "postgresql://postgres:password@localhost:5432/placeholder" }
        }
      });
    }
    
    const pool = new pg.Pool({ 
      connectionString,
      ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000 
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("❌ Failed to initialize Prisma Client with Adapter:", error);
    return new PrismaClient();
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
