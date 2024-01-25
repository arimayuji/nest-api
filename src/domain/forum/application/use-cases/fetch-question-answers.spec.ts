import { expect } from "vitest";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { FetchQuestionsAnswersUseCase } from "./fetch-question-answers";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: FetchQuestionsAnswersUseCase;

describe("Fetch Answer Answers", () => {
	beforeEach(() => {
		inMemoryAnswersAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswersAttachmentsRepository
		);
		sut = new FetchQuestionsAnswersUseCase(inMemoryAnswersRepository);
	});

	it("should be able to fetch question answers", async () => {
		const questionId = new UniqueEntityId("question-1");

		await inMemoryAnswersRepository.create(makeAnswer({ questionId }));

		await inMemoryAnswersRepository.create(makeAnswer({ questionId }));

		await inMemoryAnswersRepository.create(makeAnswer({ questionId }));

		const result = await sut.execute({
			questionId: questionId.toString(),
			page: 1,
		});

		expect(result.value?.answers).toHaveLength(3);
	});

	it("should be able to fetch paginated question answers", async () => {
		const questionId = new UniqueEntityId("question-1");

		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswersRepository.create(makeAnswer({ questionId }));
		}

		const result = await sut.execute({
			questionId: questionId.toString(),
			page: 2,
		});

		expect(result.value?.answers).toHaveLength(2);
	});
});
