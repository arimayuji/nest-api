import { Either, right, left } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { StudentAlreadyExistsError } from "./errors/student-already-exists.error";
import { Attachment } from "../../enterprise/entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { InvalidAttachmentError } from "./errors/invalid-attachment-type-error";
import { Uploader } from "../storage/uploader";

interface UploadAndCreateAttachmentUseCaseRequest {
	fileName: string;
	body: Buffer;
	fileType: string;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
	StudentAlreadyExistsError,
	{
		attachment: Attachment;
	}
>;
@Injectable()
export class UploadAndCreateAttachmentUseCase {
	constructor(
		private attachmentsRepository: AttachmentsRepository,
		private uploader: Uploader
	) {}
	async execute({
		body,
		fileName,
		fileType,
	}: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
		if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
			return left(new InvalidAttachmentError(fileType));
		}
		console.log(this.uploader);
		const { url } = await this.uploader.upload({ fileName, fileType, body });

		const attachment = Attachment.create({
			title: fileName,
			url,
		});

		await this.attachmentsRepository.create(attachment);

		return right({ attachment });
	}
}
