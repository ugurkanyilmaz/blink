// Test setup file
// This file runs before each test suite

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://blinkuser:blinkpass@localhost:5432/blinkdb_test';
process.env.ACCESS_TOKEN_SECRET = 'test_access_secret';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';
process.env.PORT = '3001';

// Increase test timeout for DB operations
jest.setTimeout(10000);

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Truncate application tables before each test to ensure a clean state.
// We intentionally do NOT touch _prisma_migrations.
const truncateSql = `TRUNCATE TABLE "RefreshToken", "Message", "Match", "Subscription", "Report", "Block", "Notification", "Referral", "Ad", "User" RESTART IDENTITY CASCADE;`;

beforeAll(async () => {
	// Ensure a clean DB before the entire test run starts
	console.log('TEST-SETUP: Truncating DB before all tests');
	await prisma.$executeRawUnsafe(truncateSql);
});

beforeEach(async () => {
	// Also truncate before each test to keep tests isolated
	// Note: this runs before each test file's tests
	await prisma.$executeRawUnsafe(truncateSql);
});

afterAll(async () => {
	await prisma.$disconnect();
});
