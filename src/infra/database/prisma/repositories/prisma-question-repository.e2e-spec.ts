import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe("Get question by slug (E2E)", () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let prisma: PrismaService;
	let attachmentFactory: AttachmentFactory;
	let cacheRepository: CacheRepository;
	let questionsRepository: QuestionsRepository;
	let questionAttachmentFactory: QuestionAttachmentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule, CacheModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();
		jwt = moduleRef.get(JwtService);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		cacheRepository = moduleRef.get(CacheRepository);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionsRepository = moduleRef.get(QuestionsRepository);
		prisma = moduleRef.get(PrismaService);
		await app.init();
	});

	it("should cache question details", async () => {
		const user = await studentFactory.makePrismaStudent({});

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment({});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		});
		const slug = question.slug.value;

		const questionDetails = await questionsRepository.findDetailsBySlug(slug);

		const cached = await cacheRepository.get(`question:${slug}:details`);

		expect(cached).toEqual(JSON.stringify(questionDetails));
	});

	it("should return cache question details on subsequent calss", async () => {
		const user = await studentFactory.makePrismaStudent({});

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment({});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		});
		const slug = question.slug.value;

		await cacheRepository.set(
			`question:${slug}:details`,
			JSON.stringify({ empty: true })
		);

		const questionDetails = await questionsRepository.findDetailsBySlug(slug);

		expect(questionDetails).toEqual({ empty: true });
	});

	it("should delete cache question details when saving the question", async () => {
		const user = await studentFactory.makePrismaStudent({});

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment({});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		});
		const slug = question.slug.value;

		await cacheRepository.set(
			`question:${slug}:details`,
			JSON.stringify({ empty: true })
		);
		await questionsRepository.save(question);

		const cached = await cacheRepository.get(`question:${slug}:details`);

		expect(cached).toBeNull();
	});
});
