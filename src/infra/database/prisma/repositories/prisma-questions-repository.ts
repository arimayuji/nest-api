import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(private prisma: PrismaService) {}
	async findById(id: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				id,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}
	create(question: Question): Promise<void> {}
	findBySlug(slug: string): Promise<Question | null> {}
	save(question: Question): Promise<void> {}
	deleteById(question: Question): Promise<void> {}
	findManyLatest(params: PaginationParams): Promise<Question[]> {}
}
