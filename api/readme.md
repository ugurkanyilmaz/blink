# Blink — TypeScript backend scaffold

This repository contains a TypeScript scaffold for a social/matchmaking backend (Express + Socket.IO + Prisma).

What was created
- TypeScript config and package.json with useful scripts
- `src/` layout matching the requested structure. All `.ts` files contain only English comments describing their responsibilities and planned exports — no executable code was added.
- `prisma/schema.prisma` placeholder and migrations folder

Next steps (suggested)
1. Run `npm install` to install dependencies listed in `package.json`.
2. Create a `.env` file and set DB/REDIS/PORT variables.
3. Implement the controllers/services/middleware following the comments inside `src/` files.
4. Run `npm run dev` to start in development (uses ts-node-dev).
