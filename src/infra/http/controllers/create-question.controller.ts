import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { TokenPayload } from "@/infra/auth/auth.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});
type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

	@Post()
	async handle(
		@CurrentUser()
		user: TokenPayload,
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema
	) {
		const { content, title } = body;
		const userId = user.sub;
		const slug = this.convertToSlug(title);
		console.log(slug);

		await this.prisma.question.create({
			data: {
				authorId: userId,
				title,
				content,
				slug: slug,
			},
		});
	}

	private convertToSlug(title: string): string {
		return title
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u836f]/g, "")
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-");
	}
}
