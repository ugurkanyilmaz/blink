/*
  Environment variables loader and typed env contract

  Planned contents:
  - Load .env using `dotenv` and export a typed config object
  - Common keys: PORT, DATABASE_URL, REDIS_URL, JWT_SECRET, REFRESH_SECRET
  - Validate required variables at startup and throw helpful error messages

  Exports (planned):
  - config: { port: number, databaseUrl: string, ... }
*/
