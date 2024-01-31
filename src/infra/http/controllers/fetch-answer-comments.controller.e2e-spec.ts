import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch answer comments (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let answerCommentFactory: AnswerCommentFactory;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AnswerCommentFactory,
				AnswerFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);
		await app.init();
	});

	test("[GET] /answers/:answerId/comments", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		await Promise.all([
			answerCommentFactory.makePrismaAnswerComment({
				content: "Comment 02",
				answerId: answer.id,
				authorId: user.id,
			}),
			answerCommentFactory.makePrismaAnswerComment({
				content: "Comment 01",
				answerId: answer.id,
				authorId: user.id,
			}),
		]);

		const answerId = answer.id.toString();

		const response = await request(app.getHttpServer())
			.get(`/answers/${answerId}/comments`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			comments: expect.arrayContaining([
				expect.objectContaining({ content: "Comment 01" }),
				expect.objectContaining({ content: "Comment 02" }),
			]),
		});
	});
});