import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
	create(notification: Notification): Promise<void> {
		
	}
	findById(id: string): Promise<Notification | null> {
		
	}
	save(notification: Notification): Promise<void> {
		
	}
}
