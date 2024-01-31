import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from "@nestjs/common";
import { TokenPayload } from "@/infra/auth/auth.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";
@Controller("/answers/comments/:id")
export class DeleteAnswerCommentController {
	constructor(private deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Param("id") answerCommentId: string
	) {
		const userId = user.sub;
		const result = await this.deleteAnswerCommentUseCase.execute({
			authorId: userId,
			answerCommentId,
		});
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
