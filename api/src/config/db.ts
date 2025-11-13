/*
  Database connection (Prisma client)

  Planned contents:
  - Initialize and export PrismaClient instance
  - Provide small helpers for transactions and graceful disconnect
  - Consider adding a wrapper to retry transient connection failures

  Important:
  - Do NOT import this file from places that run at module-eval time in tests if you want to mock Prisma.
*/
