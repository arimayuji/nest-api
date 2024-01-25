import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Notification,
	NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";
import { faker } from "@faker-js/faker";

export function makeNotification(
	override: Partial<NotificationProps> = {},
	id?: UniqueEntityId
) {
	const notification = Notification.create(
		{
			recipientId: new UniqueEntityId("1"),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			...override,
		},
		id
	);

	return notification;
}
