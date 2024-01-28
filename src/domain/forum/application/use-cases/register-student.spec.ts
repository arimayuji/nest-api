import { expect } from "vitest";
import { RegisterStudentUseCase } from "./register.student";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let hashGenerator: FakeHasher;
let sut: RegisterStudentUseCase;

describe("Register Student", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		hashGenerator = new FakeHasher();
		sut = new RegisterStudentUseCase(inMemoryStudentsRepository, hashGenerator);
	});

	it("should be able to register a new student", async () => {
		const result = await sut.execute({
			email: "johndoe@example.com",
			name: "John Doe",
			password: "123456",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			student: inMemoryStudentsRepository.items[0],
		});
	});


	it("should hash student password upon registration", async () => {
		const result = await sut.execute({
			email: "johndoe@example.com",
			name: "John Doe",
			password: "123456",
		});

		const hashedPassword = await hashGenerator.hash("123456");

		expect(result.isRight()).toBe(true);
		expect(inMemoryStudentsRepository.items[0].password).toEqual(
			hashedPassword
		);
	});
});
