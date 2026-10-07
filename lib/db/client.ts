import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Reuse a single PrismaClient (and its connection pool) across Next.js dev
// hot-reloads instead of opening a new pool on every file change.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — copy .env.example to .env and fill it in.");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Lazy on purpose: Next.js imports every route's module graph at build time
// to inspect its config, even for routes that never run at build time. If
// this connected eagerly on import, a build environment without
// DATABASE_URL set (or run before env vars are injected) would crash the
// whole build instead of just the request that actually needed the DB.
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  // No `receiver` arg here on purpose: it must default to the real client
  // instance, not this proxy, or Prisma's internal getters resolve `this`
  // to the wrong object.
  get(_target, prop) {
    return Reflect.get(getPrismaClient(), prop);
  },
});
