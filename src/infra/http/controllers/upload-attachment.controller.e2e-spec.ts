import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { StorageModule } from "@/infra/storage/storage.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe("Upload attachment(E2E)", () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule, StorageModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		prisma = moduleRef.get(PrismaService);
		await app.init();
	});

	test("[POST] /attachments", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.post("/attachments")
			.set("Authorization", `Bearer ${accessToken}`)
			.attach("file", "./test/e2e/sample-upload.jpeg");

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			attachmentId: expect.any(String),
		});
	});
});
