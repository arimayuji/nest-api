import { InvalidAttachmentError } from "@/domain/forum/application/use-cases/errors/invalid-attachment-type-error";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment";
import {
	Controller,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
	FileTypeValidator,
	MaxFileSizeValidator,
	BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/attachments")
export class UploadAttachmentController {
	constructor(
		private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase
	) {}

	@Post()
	@UseInterceptors(FileInterceptor("file"))
	async handle(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({ fileType: ".(png|jpg|jpeg|pdf)" }),
					new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), //2mb
				],
			})
		)
		file: Express.Multer.File
	) {
		const result = await this.uploadAndCreateAttachment.execute({
			fileName: file.originalname,
			fileType: file.mimetype,
			body: file.buffer,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case InvalidAttachmentError:
					throw new BadRequestException();
				default:
					throw new BadRequestException();
			}
		}

		const { attachment } = result.value;

		return {
			attachmentId: attachment.id.toString(),
		};
	}
}
