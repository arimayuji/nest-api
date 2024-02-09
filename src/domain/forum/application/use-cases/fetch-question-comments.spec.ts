import { expect } from "vitest";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
			inMemoryStudentsRepository
		);
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
	});

	it("should be able to fetch question comments", async () => {
		const student = makeStudent({
			name: "John Doe",
		});

		inMemoryStudentsRepository.items.push(student);

		const questionId = new UniqueEntityId("question-1");

		const comment1 = makeQuestionComment({
			questionId: new UniqueEntityId("question-1"),
			authorId: student.id,
		});

		await inMemoryQuestionCommentsRepository.create(comment1);

		const result = await sut.execute({
			questionId: questionId.toString(),
			page: 1,
		});

		expect(result.value!.comments).toHaveLength(1);
		expect(result.value?.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					props: {
						author: "John Doe",
						authorId: student.id,
						commentId: comment1.id,
						content: comment1.content,
						createdAt: comment1.createdAt,
						updatedAt: comment1.updatedAt,
					},
				}),
			])
		);
	});

	it("should be able to fetch paginated question comments", async () => {
		const questionId = new UniqueEntityId("question-1");
		const student = makeStudent({
			name: "John Doe",
		});

		inMemoryStudentsRepository.items.push(student);

		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({ questionId, authorId: student.id })
			);
		}

		const result = await sut.execute({
			questionId: questionId.toString(),
			page: 2,
		});

		expect(result.value!.comments).toHaveLength(2);
	});
});
