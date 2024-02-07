import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Post,
} from "@nestjs/common";
import { TokenPayload } from "@/infra/auth/auth.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-questions";

const answerQuestionBodySchema = z.object({
	content: z.string(),
	attachments: z.array(z.string().uuid()),
});
type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

@Controller("/questions/:questionId/answers")
export class AnswerQuestionController {
	constructor(private answerQuestionUseCase: AnswerQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
		@Param("questionId") questionId: string
	) {
		const { content, attachments } = body;
		const userId = user.sub;

		const result = await this.answerQuestionUseCase.execute({
			content,
			questionId,
			authorId: userId,
			attachmentsIds: attachments,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
