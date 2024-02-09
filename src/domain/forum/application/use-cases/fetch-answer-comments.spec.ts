import { expect } from "vitest";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

describe("Fetch Answer Comments", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
			inMemoryStudentsRepository
		);
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to fetch answer comments", async () => {
		const answerId = new UniqueEntityId("answer-1");
		const student = makeStudent({
			name: "John Doe",
		});

		inMemoryStudentsRepository.items.push(student);

		const answer1 = makeAnswerComment({ answerId, authorId: student.id });

		await inMemoryAnswerCommentsRepository.create(answer1);

		const result = await sut.execute({
			answerId: answerId.toString(),
			page: 1,
		});

		expect(result.value!.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					props: {
						author: "John Doe",
						answerId: answer1.id,
						authorId: student.id,
						content: answer1.content,
						createdAt: answer1.createdAt,
						updatedAt: answer1.updatedAt,
					},
				}),
			])
		);

		expect(result.value?.comments).toHaveLength(1);
	});

	it("should be able to fetch paginated answer comments", async () => {
		const answerId = new UniqueEntityId("answer-1");

		const student = makeStudent({
			name: "John Doe",
		});
		inMemoryStudentsRepository.items.push(student);
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({ answerId, authorId: student.id })
			);
		}

		const result = await sut.execute({
			answerId: answerId.toString(),
			page: 2,
		});

		expect(result.value?.comments).toHaveLength(2);
	});
});
