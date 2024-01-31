export interface UploadParam {
	fileName: string;
	fileType: string;
	body: Buffer;
}
export abstract class Uploader {
	abstract upload(params: UploadParam): Promise<{ url: string }>;
}
