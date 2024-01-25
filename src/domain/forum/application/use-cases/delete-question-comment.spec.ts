import { expect } from "vitest";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
	});

	it("should be able to delete a question comment", async () => {
		const newQuestionComment = makeQuestionComment(
			{ authorId: new UniqueEntityId("author-1") },
			new UniqueEntityId("question-1")
		);

		await inMemoryQuestionCommentsRepository.create(newQuestionComment);

		await sut.execute({
			authorId: "author-1",
			questionCommentId: "question-1",
		});

		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
	});

	it("should not be able to delete a question comment from another user", async () => {
		const newQuestionComment = makeQuestionComment(
			{ authorId: new UniqueEntityId("author-1") },
			new UniqueEntityId("question-1")
		);

		await inMemoryQuestionCommentsRepository.create(newQuestionComment);

		const result = await sut.execute({
			authorId: "author-2",
			questionCommentId: "question-1",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
