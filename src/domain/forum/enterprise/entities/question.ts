import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Slug } from "./value-objects/slug";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { QuestionAttachmentList } from "./question-attachment-list";
import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event";

export interface QuestionProps {
	title: string;
	content: string;
	slug: Slug;
	authorId: UniqueEntityId;
	createdAt: Date;
	attachments: QuestionAttachmentList;
	updatedAt?: Date;
	bestAnswerId?: UniqueEntityId;
}
export class Question extends AggregateRoot<QuestionProps> {
	private touch() {
		this.props.updatedAt = new Date();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	get content() {
		return this.props.content;
	}

	get attachments() {
		return this.props.attachments;
	}

	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
		if (bestAnswerId === undefined) {
			return;
		}

		if (
			this.props.bestAnswerId === undefined ||
			this.props.bestAnswerId.equals(bestAnswerId)
		) {
			this.addDomainEvent(
				new QuestionBestAnswerChosenEvent(this, bestAnswerId)
			);
		}

		this.props.bestAnswerId = bestAnswerId;
		this.touch();
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createFromText(title);
		this.touch();
	}

	get title() {
		return this.props.title;
	}

	get authorId() {
		return this.props.authorId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get slug() {
		return this.props.slug;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static create(
		props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
		id?: UniqueEntityId
	) {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				attachments: props.attachments ?? new QuestionAttachmentList(),
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return question;
	}
}
