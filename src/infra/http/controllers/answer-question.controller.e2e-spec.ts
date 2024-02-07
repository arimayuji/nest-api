import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { AttachmentFactory } from "test/factories/make-attachment";

describe("Answer question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let attachmentFactory: AttachmentFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		prisma = moduleRef.get(PrismaService);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		studentFactory = moduleRef.get(StudentFactory);
		await app.init();
	});

	test("[POST] /answers/:answerId/answers", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const questionId = question.id.toString();

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.post(`/questions/${questionId}/answers`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				content: "New content",
				attachments: [attachment1.id.toString(), attachment2.id.toString()],
			});

		expect(response.statusCode).toBe(201);

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				content: "New content",
			},
		});

		expect(answerOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				answerId: answerOnDatabase?.id,
			},
		});
		expect(attachmentsOnDatabase).toHaveLength(2);
	});
});
