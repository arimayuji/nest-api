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
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
const commentOnAnswerBodySchema = z.object({
	content: z.string(),
});
type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
	constructor(private commentOnAnswerUseCase: CommentOnAnswerUseCase) {}

	@Post()
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
		@Param("answerId") answerId: string
	) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.commentOnAnswerUseCase.execute({
			content,
			answerId,
			authorId: userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
