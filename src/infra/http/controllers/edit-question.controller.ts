import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Put,
} from "@nestjs/common";
import { TokenPayload } from "@/infra/auth/auth.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});
type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

@Controller("/questions/:questionId")
export class EditQuestionController {
	constructor(private editQuestionUseCase: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Body(bodyValidationPipe) body: EditQuestionBodySchema,
		@Param("questionId") questionId: string
	) {
		const { content, title } = body;
		const userId = user.sub;

		const result = await this.editQuestionUseCase.execute({
			title,
			content,
			authorId: userId,
			attachmentIds: [],
			questionId,
		});
      
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
