import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	QuestionComment,
	QuestionCommentsProps,
} from "@/domain/forum/enterprise/entities/question-comment";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

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
@Injectable()
export class QuestionCommentFactory {
	constructor(private prisma: PrismaService) {}
	async makePrismaQuestionComment(
		data: Partial<QuestionCommentsProps> = {}
	): Promise<QuestionComment> {
		const question = makeQuestionComment(data);

		await this.prisma.comment.create({
			data: PrismaQuestionCommentMapper.toPrisma(question),
		});

		return question;
	}
}
