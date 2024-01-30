import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	AnswerComment,
	AnswerCommentsProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

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
@Injectable()
export class AnswerCommentFactory {
	constructor(private prisma: PrismaService) {}
	async makePrismaAnswer(
		data: Partial<AnswerCommentsProps> = {}
	): Promise<AnswerComment> {
		const answer = makeAnswerComment(data);

		await this.prisma.comment.create({
			data: PrismaAnswerCommentMapper.toPrisma(answer),
		});

		return answer;
	}
}
