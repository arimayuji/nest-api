import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	public items: QuestionComment[] = [];

	constructor(private inMemoryStudentsRepository: InMemoryStudentsRepository) {}

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment);
	}

	async delete(questionComment: QuestionComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id === questionComment.id
		);

		this.items.splice(itemIndex, 1);
	}

	async findById(id: string) {
		const questionComment = this.items.find(
			(item) => item.id.toString() === id
		);

		if (!questionComment) {
			return null;
		}

		return questionComment;
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const resultsPerPage = 20;

		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * resultsPerPage, page * resultsPerPage);

		return questionComments;
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		{ page }: PaginationParams
	) {
		const resultsPerPage = 20;
		
		const questionCommentsWithAuthor = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * resultsPerPage, page * resultsPerPage)
			.map((comment) => {
				const author = this.inMemoryStudentsRepository.items.find((student) => {
					return student.id.equals(comment.authorId);
				});

				if (!author) {
					throw new Error(
						`Author with ID "${comment.authorId.toString()}" does not exist`
					);
				}

				return CommentWithAuthor.create({
					content: comment.content,
					commentId: comment.id,
					authorId: comment.authorId,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
					author: author.name,
				});
			});

		return questionCommentsWithAuthor;
	}
}
