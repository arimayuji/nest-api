import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { randomUUID } from "crypto";
import "dotenv/config";

const prisma = new PrismaClient();

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

	execSync("npm prisma migrate deploy");
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(
		`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE `
	);
	await prisma.$disconnect();
});
