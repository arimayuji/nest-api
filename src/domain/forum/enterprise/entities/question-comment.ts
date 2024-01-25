import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { CommentProps } from "./comment";
import { Comment } from "./comment";

export interface QuestionCommentsProps extends CommentProps {
	questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<QuestionCommentsProps> {
	get questionId() {
		return this.props.questionId;
	}

	static create(
		props: Optional<QuestionCommentsProps, "createdAt">,
		id?: UniqueEntityId
	) {
		const questionComment = new QuestionComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return questionComment;
	}
}
