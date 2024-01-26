import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionAttachmentRepository } from "./prisma/repositories/prisma-questions-attachmentsrepository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answers-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";

@Module({
	providers: [
		PrismaService,
		PrismaQuestionAttachmentRepository,
		PrismaQuestionCommentsRepository,
		PrismaQuestionsRepository,
		PrismaNotificationsRepository,
		PrismaAnswerCommentsRepository,
		PrismaAnswersRepository,
	],
	exports: [
		PrismaService,
		PrismaService,
		PrismaQuestionAttachmentRepository,
		PrismaQuestionCommentsRepository,
		PrismaQuestionsRepository,
		PrismaNotificationsRepository,
		PrismaAnswerCommentsRepository,
		PrismaAnswersRepository,
	],
})
export class DatabaseModule {}
