import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface StudentProps {
	name: string;
	email: string;
	password: string;
}
export class Student extends AggregateRoot<StudentProps> {
	static create(props: StudentProps, id?: UniqueEntityId) {
		const student = new Student(
			{
				...props,
			},
			id
		);

		return student;
	}
	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email;
	}

	get password() {
		return this.props.password;
	}
}
