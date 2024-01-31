import { expect } from "vitest";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidAttachmentError } from "./errors/invalid-attachment-type-error";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let hashGenerator: FakeHasher;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		fakeUploader = new FakeUploader();
		sut = new UploadAndCreateAttachmentUseCase(
			inMemoryAttachmentsRepository,
			fakeUploader
		);
	});

	it("should be able to update and create an attachment", async () => {
		const result = await sut.execute({
			fileName: "profile.png",
			fileType: "image/png",
			body: Buffer.from(""),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentsRepository.items[0],
		});
	});

	it("should not be able upload and create an attachment with invalid file type", async () => {
		const result = await sut.execute({
			fileName: "profile.mp3",
			fileType: "audio/mpeg",
			body: Buffer.from(""),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidAttachmentError);
	});
});
