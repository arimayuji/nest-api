import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface AttachmentProps {
	link: string;
	title: string;
	parentType: "answer" | "question";
}
export class Attachment extends Entity<AttachmentProps> {
	get title() {
		return this.props.title;
	}
	get link() {
		return this.props.link;
	}

	static create(props: AttachmentProps, id?: UniqueEntityId) {
		const attachment = new Attachment(props, id);

		return attachment;
	}
}
