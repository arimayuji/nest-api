import { expect } from "vitest";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "../../enterprise/entities/fetch-question-comments";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "test/factories/make-question-comment";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
	});

	it("should be able to fetch question comments", async () => {
		const questionId = new UniqueEntityId("question-1");

		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId })
		);

		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId })
		);

		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId })
		);

		const result = await sut.execute({
			questionId: questionId.toString(),
			page: 1,
		});

		expect(result.value!.questionComments).toHaveLength(3);
	});

	it("should be able to fetch paginated question comments", async () => {
		const questionId = new UniqueEntityId("question-1");

		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({ questionId })
			);
		}

		const result = await sut.execute({
			questionId: questionId.toString(),
			page: 2,
		});

		expect(result.value!.questionComments).toHaveLength(2);
	});
});
