import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	QuestionComment,
	QuestionCommentsProps,
} from "@/domain/forum/enterprise/entities/question-comment";
import { faker } from "@faker-js/faker";

export function makeQuestionComment(
	override: Partial<QuestionCommentsProps> = {},
	id?: UniqueEntityId
) {
	const questionComment = QuestionComment.create(
		{
			authorId: new UniqueEntityId("1"),
			content: faker.lorem.text(),
			questionId: new UniqueEntityId("1"),
			...override,
		},
		id
	);

	return questionComment;
}
