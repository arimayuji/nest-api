import { DomainEvents } from "@/core/events/domain-events";
import { envSchema } from "@/infra/env/env";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { config } from "dotenv";
import { Redis } from "ioredis";
config({
	path: ".env",
	override: true,
});
config({
	path: ".env.test",
	override: true,
});

const env = envSchema.parse(process.env);
const prisma = new PrismaClient();
const redis = new Redis({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	db: env.REDIS_DB,
});

function generateUniqueDatabaseURL(schemaId: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error("No DATABASE_URL provided");
	}
	const url = new URL(process.env.DATABASE_URL);

	url.searchParams.set("schema", schemaId);

	return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
	const databaseUrl = generateUniqueDatabaseURL(schemaId);

	process.env.DATABASE_URL = databaseUrl;

	DomainEvents.shouldRun = false;

	await redis.flushdb();
	
	execSync("npx prisma migrate deploy");
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(
		`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE `
	);
	await prisma.$disconnect();
});
