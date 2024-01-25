import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Comment, CommentProps } from "./comment";

export interface AnswerCommentsProps extends CommentProps {
	answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<AnswerCommentsProps> {
	get answerId() {
		return this.props.answerId;
	}

	static create(
		props: Optional<AnswerCommentsProps, "createdAt">,
		id?: UniqueEntityId
	) {
		const answerComment = new AnswerComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return answerComment;
	}
}
