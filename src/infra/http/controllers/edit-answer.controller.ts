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
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";

const editAnswerBodySchema = z.object({
	content: z.string(),
});
type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

@Controller("/answers/:id")
export class EditAnswerController {
	constructor(private editAnswerUseCase: EditAnswerUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Body(bodyValidationPipe) body: EditAnswerBodySchema,
		@Param("id") answerId: string
	) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.editAnswerUseCase.execute({
			content,
			answerId,
			authorId: userId,
			attachmentIds: [],
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
