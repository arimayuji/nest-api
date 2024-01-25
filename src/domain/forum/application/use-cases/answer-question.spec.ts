import { expect } from "vitest";
import { AnswerQuestionUseCase } from "./answer-questions";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe("Create Answer", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswersAttachmentsRepository
		);
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	it("create an answer", async () => {
		const result = await sut.execute({
			questionId: "1",
			authorId: "1",
			content: "Nova Resposta",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
		expect(
			inMemoryAnswersRepository.items[0].attachments.currentItems
		).toHaveLength(2);
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
				expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
			]
		);
	});
});
