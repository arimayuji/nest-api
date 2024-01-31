import {
	Controller,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
	FileTypeValidator,
	MaxFileSizeValidator,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/attachments")
export class UploadAttachmentController {
	// constructor() {}

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
	) {}
}
