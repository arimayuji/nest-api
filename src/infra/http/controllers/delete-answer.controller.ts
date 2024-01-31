import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from "@nestjs/common";
import { TokenPayload } from "@/infra/auth/auth.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
@Controller("/answers/:answerId")
export class DeleteAnswerController {
	constructor(private deleteAnswerUseCase: DeleteAnswerUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Param("answerId") answerId: string
	) {
		const userId = user.sub;
		const result = await this.deleteAnswerUseCase.execute({
			answerId,
			authorId: userId,
		});
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
