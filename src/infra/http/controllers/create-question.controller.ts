import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { TokenPayload } from "@/infra/auth/auth.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachments: z.array(z.string().uuid()),
});
type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller("/questions")
export class CreateQuestionController {
	constructor(private createQuestionUseCase: CreateQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema
	) {
		const { content, title, attachments } = body;
		const userId = user.sub;

		const result = await this.createQuestionUseCase.execute({
			title,
			content,
			authorId: userId,
			attachmentsIds: attachments,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
