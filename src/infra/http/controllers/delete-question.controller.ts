import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from "@nestjs/common";
import { TokenPayload } from "@/infra/auth/auth.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
@Controller("/questions/:questionId")
export class DeleteQuestionController {
	constructor(private deleteQuestionUseCase: DeleteQuestionUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Param("questionId") questionId: string
	) {
		const userId = user.sub;
		const result = await this.deleteQuestionUseCase.execute({
			questionId,
			authorId: userId,
		});
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
