import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Attachment as PrismaAttachment, Prisma } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
	static toDomain(raw: PrismaAttachment): QuestionAttachment {
		if (!raw.questionId) {
			throw new Error("Invalid attachment type");
		}
		return QuestionAttachment.create(
			{
				questionId: new UniqueEntityId(raw.questionId),
				attachmentId: new UniqueEntityId(raw.id),
			},
			new UniqueEntityId(raw.id)
		);
	}
	static toPrismaUpdateMany(
		attachments: QuestionAttachment[]
	): Prisma.AttachmentUpdateManyArgs {
		const attachmentIds = attachments.map((attachment) => {
			return attachment.attachmentId.toString();
		});

		const questionId = attachments[0].questionId.toString();
        
		return {
			where: {
				id: {
					in: attachmentIds,
				},
			},
			data: {
				questionId,
			},
		};
	}
	
	static toPrismaDeleteMany(
		attachments: QuestionAttachment[]
	): Prisma.AttachmentDeleteManyArgs {
		const attachmentIds = attachments.map((attachment) => {
			return attachment.id.toString();
		});

		return {
			where: {
				id: {
					in: attachmentIds,
				},
			},
		};
	}
}
