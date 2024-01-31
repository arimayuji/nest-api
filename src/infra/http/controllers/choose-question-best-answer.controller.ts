import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Patch,
} from "@nestjs/common";
import { TokenPayload } from "@/infra/auth/auth.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";

@Controller("/answers/:answerId/choose-as-best")
export class ChooseQuestionBestAnswerController {
	constructor(
		private chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase
	) {}

	@Patch()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: TokenPayload,

		@Param("answerId") answerId: string
	) {
		const userId = user.sub;

		const result = await this.chooseQuestionBestAnswerUseCase.execute({
			answerId,
			authorId: userId,
		});
     
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
