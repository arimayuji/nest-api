import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answer-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
	constructor(private answerAttachmentRepository: AnswerAttachmentRepository) {}
	public items: Answer[] = [];

	async create(answer: Answer) {
		this.items.push(answer);
		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async delete(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id);

		this.items.splice(itemIndex, 1);

		this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
	}

	async findById(id: string) {
		const answer = this.items.find((item) => item.id.toString() === id);

		if (!answer) {
			return null;
		}

		return answer;
	}

	async save(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id);

		this.items[itemIndex] = answer;

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const resultsPerPage = 20;

		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * resultsPerPage, page * resultsPerPage);

		return answers;
	}
}
