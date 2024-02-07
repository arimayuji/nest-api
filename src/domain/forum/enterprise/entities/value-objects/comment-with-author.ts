import { ValueObject } from "@/core/entities/value-object";

export interface CommentWithAuthorProps {
	commentId: string;
	content: string;
	authorName: string;
	authorId: string;
	createdAt: Date;
	updatedAt?: Date | null;
}
export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
	get commentId() {
		return this.props.commentId;
	}

	get content() {
		return this.props.content;
	}

	get authorName() {
		return this.props.authorName;
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

	static create(props: CommentWithAuthorProps) {
		return new CommentWithAuthor(props);
	}
}
