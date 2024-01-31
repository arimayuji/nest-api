import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";

describe("Comment on answer (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let answerFactory: AnswerFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AnswerFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		prisma = moduleRef.get(PrismaService);
		answerFactory = moduleRef.get(AnswerFactory);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		await app.init();
	});

	test("[POST] /answers/:answerId/comments", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const answerId = answer.id.toString();

		const response = await request(app.getHttpServer())
			.post(`/answers/${answerId}/comments`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				content: "New content",
			});

		expect(response.statusCode).toBe(201);

		const commentOnDatabase = await prisma.comment.findFirst({
			where: {
				content: "New content",
			},
		});

		expect(commentOnDatabase).toBeTruthy();
	});
});
