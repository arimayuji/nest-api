import { UniqueEntityId } from "../entities/unique-entity-id";

// estrutura de um evento de domínio - ocurredAt : data de ocorrência, id da entidade principal
export interface DomainEvent {
	ocurredAt: Date;
	getAggregateId(): UniqueEntityId;
}
