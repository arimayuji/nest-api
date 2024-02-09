import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { Slug } from "./slug";
import { Attachment } from "../attachment";

export interface QuestionDetailsProps {
	questionId: UniqueEntityId;
	authorId: UniqueEntityId;
	bestAnswerId?: UniqueEntityId | null;
	author: string;
	title: string;
	content: string;
	slug: Slug;
	attachments: Attachment[];
	createdAt: Date;
	updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
	get questionId() {
		return this.props.questionId;
	}

	get title() {
		return this.props.title;
	}

	get slug() {
		return this.props.slug;
	}

	get attachments() {
		return this.props.attachments;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	get content() {
		return this.props.content;
	}

	get author() {
		return this.props.author;
	}

	get authorId() {
		return this.props.authorId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static create(props: QuestionDetailsProps) {
		return new QuestionDetails(props);
	}
}
