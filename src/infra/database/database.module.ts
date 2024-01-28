import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionAttachmentRepository } from "./prisma/repositories/prisma-questions-attachmentsrepository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answers-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/student.repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository";

@Module({
	providers: [
		PrismaService,
		PrismaQuestionAttachmentRepository,
		PrismaQuestionCommentsRepository,
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		{
			provide: StudentsRepository,
			useClass: PrismaStudentsRepository,
		},
		PrismaNotificationsRepository,
		PrismaAnswerCommentsRepository,
		PrismaAnswersRepository,
	],
	exports: [
		PrismaService,
		PrismaService,
		PrismaQuestionAttachmentRepository,
		PrismaQuestionCommentsRepository,
		QuestionsRepository,
		StudentsRepository,
		PrismaNotificationsRepository,
		PrismaAnswerCommentsRepository,
		PrismaAnswersRepository,
	],
})
export class DatabaseModule {}
