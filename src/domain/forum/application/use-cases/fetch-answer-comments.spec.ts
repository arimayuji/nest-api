import { expect } from "vitest";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to fetch answer comments", async () => {
		const answerId = new UniqueEntityId("answer-1");

		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId })
		);

		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId })
		);

		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId })
		);

		const result = await sut.execute({
			answerId: answerId.toString(),
			page: 1,
		});

		expect(result.value?.answerComments).toHaveLength(3);
	});

	it("should be able to fetch paginated answer comments", async () => {
		const answerId = new UniqueEntityId("answer-1");

		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({ answerId })
			);
		}

		const result = await sut.execute({
			answerId: answerId.toString(),
			page: 2,
		});

		expect(result.value?.answerComments).toHaveLength(2);
	});
});
