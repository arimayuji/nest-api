import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { AnswerFactory } from "test/factories/make-answer";
import { AttachmentFactory } from "test/factories/make-attachment";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";

describe("Edit answer (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let attachmentFactory: AttachmentFactory;
	let answerAttachmentFactory: AnswerAttachmentFactory;
	let answerFactory: AnswerFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AnswerFactory,
				AnswerAttachmentFactory,
				AttachmentFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		prisma = moduleRef.get(PrismaService);
		answerFactory = moduleRef.get(AnswerFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		studentFactory = moduleRef.get(StudentFactory);
		await app.init();
	});

	test("[PUT] /answers/:id", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			questionId: question.id,
			authorId: user.id,
		});

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		await answerAttachmentFactory.makePrismaAnswerAttachment({
			attachmentId: attachment1.id,
			answerId: answer.id,
		});

		await answerAttachmentFactory.makePrismaAnswerAttachment({
			attachmentId: attachment2.id,
			answerId: answer.id,
		});

		const attachment3 = await attachmentFactory.makePrismaAttachment();
		const answerId = answer.id.toString();

		const response = await request(app.getHttpServer())
			.put(`/answers/${answerId}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				content: "New content updated",
				attachments: [attachment1.id.toString(), attachment3.id.toString()],
			});

		expect(response.statusCode).toBe(204);

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				content: "New content updated",
			},
		});
		expect(answerOnDatabase).toBeTruthy();
		
		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				answerId: answerOnDatabase?.id,
			},
		});
		expect(attachmentsOnDatabase).toHaveLength(2);
		expect(attachmentsOnDatabase).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: attachment1.id.toString(),
				}),
				expect.objectContaining({
					id: attachment3.id.toString(),
				}),
			])
		);
	});
});
