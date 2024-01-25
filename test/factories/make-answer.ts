import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { faker } from "@faker-js/faker";

export function makeAnswer(
	override: Partial<AnswerProps> = {},
	id?: UniqueEntityId
) {
	const answer = Answer.create(
		{
			questionId: new UniqueEntityId("1"),
			authorId: new UniqueEntityId("1"),
			content: faker.lorem.text(),
			...override,
		},
		id
	);

	return answer;
}
