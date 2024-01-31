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
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
const commentOnQuestionBodySchema = z.object({
	content: z.string(),
});
type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
	constructor(private commentOnQuestionUseCase: CommentOnQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
		@Param("questionId") questionId: string
	) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.commentOnQuestionUseCase.execute({
			content,
			questionId,
			authorId: userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
