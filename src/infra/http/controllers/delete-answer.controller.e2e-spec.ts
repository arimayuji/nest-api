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

describe("Delete answer (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let answerFactory: AnswerFactory;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory,AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		prisma = moduleRef.get(PrismaService);
		answerFactory = moduleRef.get(AnswerFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		studentFactory = moduleRef.get(StudentFactory);
		await app.init();
	});

	test("[DELETE] /answers/:id", async () => {
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
			.delete(`/answers/${answerId}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(204);

		const answerOnDatabase = await prisma.answer.findUnique({
			where: {
				id: answerId,
			},
		});
        
		expect(answerOnDatabase).toBeNull();
	});
});
