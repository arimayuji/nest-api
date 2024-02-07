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

describe("Choose question best answer (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let answerFactory: AnswerFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		prisma = moduleRef.get(PrismaService);
		answerFactory = moduleRef.get(AnswerFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		studentFactory = moduleRef.get(StudentFactory);
		await app.init();
	});

	test("[PATCH] /answers/:answerId/choose-as-best", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			questionId: question.id,
			authorId: user.id,
		});

		const answerId = answer.id.toString();

		const response = await request(app.getHttpServer())
			.patch(`/answers/${answerId}/choose-as-best`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(204);

		const questionOnDatabase = await prisma.question.findUnique({
			where: {
				id: question.id.toString(),
			},
		});
		expect(questionOnDatabase?.bestAnswerId).toEqual(answerId);
	});
});
