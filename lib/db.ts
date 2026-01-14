import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  try {
    // Use a smaller pool size for serverless/build environments to avoid exhausting connections
    const poolConfig = {
      connectionString,
      max: process.env.DB_MAX_CONNECTIONS ? parseInt(process.env.DB_MAX_CONNECTIONS) : 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

    const pool = globalForPrisma.pool ?? new Pool(poolConfig);

    // Handle unexpected pool errors to prevent crash
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    const adapter = new PrismaPg(pool);

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.pool = pool;
    }

    const client = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });

    return client;
  } catch (error) {
    console.error("❌ Prisma Initialization Error:", error);
    throw error;
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
