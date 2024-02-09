import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import {
	Question as PrismaQuestion,
	Attachment as PrismaAttachment,
	User as PrismaUser,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaQuestionDetails = PrismaQuestion & {
	author: PrismaUser;
	attachments: PrismaAttachment[];
};
export class PrismaQuestionDetailsMapper {
	static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
		return QuestionDetails.create({
			questionId: new UniqueEntityId(raw.id),
			authorId: new UniqueEntityId(raw.authorId),
			author: raw.author.name,
			content: raw.content,
			slug: Slug.create(raw.slug),
			title: raw.title,
			bestAnswerId: raw.bestAnswerId
				? new UniqueEntityId(raw.bestAnswerId)
				: null,
			attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		});
	}
}
