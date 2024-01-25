import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		prisma = moduleRef.get(PrismaService);
		await app.init();
	});

	test("[POST] /questions", async () => {
		const user = await prisma.user.create({
			data: {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "fake-hash",
			},
		});

		const accessToken = jwt.sign({ sub: user.id });

		const response = await request(app.getHttpServer())
			.post("/questions")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				title: "New Question",
				content: "Question Content",
			});

		expect(response.statusCode).toBe(201);

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: "New Question",
			},
		});

		expect(questionOnDatabase).toBeTruthy();
	});
});