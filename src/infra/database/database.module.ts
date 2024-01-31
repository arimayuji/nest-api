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
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answer-repository";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { PrismaAnswerAttachmentRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
@Module({
	providers: [
		PrismaService,
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},

		{
			provide: StudentsRepository,
			useClass: PrismaStudentsRepository,
		},
		{
			provide: NotificationsRepository,
			useClass: PrismaNotificationsRepository,
		},
		{
			provide: AnswerCommentsRepository,
			useClass: PrismaAnswerCommentsRepository,
		},
		{ provide: AnswersRepository, useClass: PrismaAnswersRepository },
		{
			provide: AnswerAttachmentRepository,
			useClass: PrismaAnswerAttachmentRepository,
		},
		{
			provide: QuestionAttachmentRepository,
			useClass: PrismaQuestionAttachmentRepository,
		},
		{
			provide: QuestionCommentsRepository,
			useClass: PrismaQuestionCommentsRepository,
		},
	],
	exports: [
		PrismaService,
		PrismaService,
		QuestionAttachmentRepository,
		QuestionCommentsRepository,
		QuestionsRepository,
		StudentsRepository,
		NotificationsRepository,
		AnswerCommentsRepository,
		AnswersRepository,
		AnswerAttachmentRepository,
	],
})
export class DatabaseModule {}
