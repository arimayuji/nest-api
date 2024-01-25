import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	AnswerComment,
	AnswerCommentsProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { faker } from "@faker-js/faker";

export function makeAnswerComment(
	override: Partial<AnswerCommentsProps> = {},
	id?: UniqueEntityId
) {
	const answerComment = AnswerComment.create(
		{
			authorId: new UniqueEntityId("1"),
			content: faker.lorem.text(),
			answerId: new UniqueEntityId("1"),
			...override,
		},
		id
	);

	return answerComment;
}
