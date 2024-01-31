import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from "@nestjs/common";
import { TokenPayload } from "@/infra/auth/auth.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";
@Controller("/questions/comments/:id")
export class DeleteQuestionCommentController {
	constructor(
		private deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase
	) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Param("id") questionCommentId: string
	) {
		const userId = user.sub;
		const result = await this.deleteQuestionCommentUseCase.execute({
			authorId: userId,
			questionCommentId,
		});
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
