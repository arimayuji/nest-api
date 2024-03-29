import { expect } from "vitest";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: CommentOnAnswerUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

describe("Comment on Answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);
		inMemoryStudentsRepository = new InMemoryStudentsRepository();

		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
			inMemoryStudentsRepository
		);

		sut = new CommentOnAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerCommentsRepository
		);
	});

	it("should be able to comment on  answer", async () => {
		const answer = makeAnswer();

		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			authorId: answer.authorId.toString(),
			content: "Test Comment",
			answerId: answer.id.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
			"Test Comment"
		);
	});
});
