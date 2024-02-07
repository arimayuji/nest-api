import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Attachment as PrismaAttachment, Prisma } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
	static toDomain(raw: PrismaAttachment): AnswerAttachment {
		if (!raw.answerId) {
			throw new Error("Invalid attachment type");
		}
		return AnswerAttachment.create(
			{
				answerId: new UniqueEntityId(raw.answerId),
				attachmentId: new UniqueEntityId(raw.id),
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrismaUpdateMany(
		attachments: AnswerAttachment[]
	): Prisma.AttachmentUpdateManyArgs {
		const attachmentIds = attachments.map((attachment) => {
			return attachment.attachmentId.toString();
		});

		const answerId = attachments[0].answerId.toString();

		return {
			where: {
				id: {
					in: attachmentIds,
				},
			},
			data: {
				answerId,
			},
		};
	}

	static toPrismaDeleteMany(
		attachments: AnswerAttachment[]
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
