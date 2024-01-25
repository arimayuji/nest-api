import { Either, right } from "@/core/either";
import { QuestionComment } from "./question-comment";
import { QuestionCommentsRepository } from "../../application/repositories/question-comments-repository";

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		questionComments: QuestionComment[];
	}
>;

export class FetchQuestionCommentsUseCase {
	constructor(private answersRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments = await this.answersRepository.findManyByQuestionId(
			questionId,
			{ page }
		);

		return right({ questionComments });
	}
}
