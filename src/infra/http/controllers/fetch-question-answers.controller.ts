import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchQuestionsAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { AnswerPresenter } from "../presenters/answer-presenter";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
@Controller("/questions/:questionId/answers")
export class FetchQuestionAnswersController {
	constructor(private fetchQuestionAnswers: FetchQuestionsAnswersUseCase) {}

	@Get()
	async handle(
		@Query("page", queryValidationPipe) page: PageQueryParamSchema,
		@Param("questionId") questionId: string
	) {
		const result = await this.fetchQuestionAnswers.execute({
			questionId,
			page,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { answers } = result.value;

		return {
			answers: answers.map(AnswerPresenter.toHTTP),
		};
	}
}
