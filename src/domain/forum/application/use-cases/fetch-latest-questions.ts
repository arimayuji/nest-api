import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";

interface FetchLatestQuestionsUseCaseRequest {
	page: number;
}

type FetchLatestQuestionsUseCaseResponse = Either<
	null,
	{
		questions: Question[];
	}
>;
export class FetchLatestQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		page,
	}: FetchLatestQuestionsUseCaseRequest): Promise<FetchLatestQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.findManyLatest({ page });

		return right({ questions });
	}
}
