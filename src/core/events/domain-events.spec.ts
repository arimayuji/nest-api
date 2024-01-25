import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";
import { vi } from "vitest";
class CustomAggregateCreated implements DomainEvent {
	public ocurredAt: Date;
	private aggregate: CustomAggregate;

	constructor(aggregate: CustomAggregate) {
		this.ocurredAt = new Date();
		this.aggregate = aggregate;
	}

	public getAggregateId(): UniqueEntityId {
		return this.aggregate.id;
	}
}
class CustomAggregate extends AggregateRoot<any> {
	static create() {
		const aggregate = new CustomAggregate(null);

		aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

		return aggregate;
	}
}

describe("domain events", () => {
	it("should be able to dispatch and listen to events", () => {
		const callbackSpy = vi.fn();

		// cadastro do subscriber

		DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

		// criação de uma resposta sem salvar no banco.

		const aggregate = CustomAggregate.create();

		// teste para averiguar se o evento do agregado foi criado mas não disparado.

		expect(aggregate.domainEvents).toHaveLength(1);

		// registra no banco e assim dispara o evento

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		// subscriber escuta o evento e faz o que precisa se feito

		expect(callbackSpy).toHaveBeenCalled();
		expect(aggregate.domainEvents).toHaveLength(0);
	});
});
