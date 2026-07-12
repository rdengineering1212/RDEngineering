let prisma: any;

try {
  const { PrismaClient } = require("@prisma/client");

  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined;
  };

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? [] : [],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch (error) {
  console.warn("[Prisma] Client not available. Database features will be disabled.");
  // Create a mock prisma client that returns sensible defaults for all operations
  prisma = new Proxy({}, {
    get: (_: any, modelName: string | symbol) => new Proxy({}, {
      get: (_: any, operation: string | symbol) => {
        return async (..._args: any[]) => {
          console.warn(`[Prisma Mock] ${String(modelName)}.${String(operation)}() called - DB not configured`);
          // Return sensible defaults for each operation type
          if (operation === "count") return 0;
          if (operation === "findFirst" || operation === "findUnique") return null;
          if (operation === "findMany") return [];
          if (operation === "create") return { id: `mock-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
          if (operation === "update") return { id: `mock-${Date.now()}` };
          if (operation === "delete") return { id: `mock-${Date.now()}` };
          if (operation === "upsert") return { id: `mock-${Date.now()}` };
          return null;
        };
      },
    }),
  });
}

export { prisma };
