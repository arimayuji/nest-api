import { expect } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository
		);
		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository
		);
	});

	it("should be able to edit a question attachment", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityId("author-1") },
			new UniqueEntityId("question-1")
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId("1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId("2"),
			})
		);

		await sut.execute({
			authorId: "author-1",
			questionId: newQuestion.id.toValue(),
			title: "Pergunta Teste",
			content: "Conteúdo Teste",
			attachmentIds: ["1", "3"],
		});

		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: "Pergunta Teste",
			content: "Conteúdo Teste",
		});

		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems
		).toHaveLength(2);
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
		]);
	});

	it("should not be able to edit a question from another user", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityId("author-1") },
			new UniqueEntityId("question-1")
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			authorId: "author-2",
			questionId: newQuestion.id.toString(),
			title: "Pergunta Teste",
			content: "Conteúdo Teste",
			attachmentIds: [],
		});
		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});

	it("should sync new and remove attachments when editing ", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityId("author-1") },
			new UniqueEntityId("question-1")
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId("1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId("2"),
			})
		);

		const result = await sut.execute({
			authorId: "author-1",
			questionId: newQuestion.id.toValue(),
			title: "Pergunta Teste",
			content: "Conteúdo Teste",
			attachmentIds: ["1", "3"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId("1"),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId("3"),
				}),
			])
		);
	});
});
