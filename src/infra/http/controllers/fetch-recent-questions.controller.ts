import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchLatestQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-latest-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
	constructor(private fetchLatest: FetchLatestQuestionsUseCase) {}

	@Get()
	async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
		const result = await this.fetchLatest.execute({
			page,
		});
		if (result.isLeft()) {
			throw new Error();
		}

		const { questions } = result.value;

		return {
			questions: questions.map(QuestionPresenter.toHTTP),
		};
	}
}
