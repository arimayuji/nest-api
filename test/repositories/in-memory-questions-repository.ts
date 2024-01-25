import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	constructor(
		private questionAttachmentsRepository: QuestionAttachmentRepository
	) {}

	async create(question: Question) {
		this.items.push(question);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items[itemIndex] = question;

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async findManyLatest({ page }: PaginationParams) {
		const resultsPerPage = 20;

		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * resultsPerPage, page * resultsPerPage);

		return questions;
	}

	async findBySlug(slug: string) {
		const question = this.items.find((item) => item.slug.value === slug);

		if (!question) {
			return null;
		}
		return question;
	}

	async deleteById(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);
		this.items.splice(itemIndex, 1);

		this.questionAttachmentsRepository.deleteManyByQuestionId(
			question.id.toValue()
		);
	}

	async findById(id: string) {
		const question = this.items.find((item) => item.id.toString() === id);

		if (!question) {
			return null;
		}

		return question;
	}
}
