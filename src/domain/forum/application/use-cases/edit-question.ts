import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { QuestionAttachmentRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface EditQuestionUseCaseRequest {
	authorId: string;
	title: string;
	content: string;
	questionId: string;
	attachmentIds: string[];
}

type EditQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;
@Injectable()
export class EditQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentRepository
	) {}

	async execute({
		title,
		content,
		authorId,
		questionId,
		attachmentIds,
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== question.authorId.toString()) {
			return left(new NotAllowedError());
		}

		const currentQuestionAttachments =
			await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

		const questionAttachmentList = new QuestionAttachmentList(
			currentQuestionAttachments
		);

		const questionAttachments = attachmentIds.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			});
		});

		questionAttachmentList.update(questionAttachments);

		question.title = title;
		question.content = content;
		question.attachments = questionAttachmentList;

		await this.questionsRepository.save(question);

		return right({ question });
	}
}
