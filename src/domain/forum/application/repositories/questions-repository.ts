import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";

export abstract class QuestionsRepository {
	abstract findById(id: string): Promise<Question | null>;
	abstract create(question: Question): Promise<void>;
	abstract findBySlug(slug: string): Promise<Question | null>;
	abstract save(question: Question): Promise<void>;
	abstract deleteById(question: Question): Promise<void>;
	abstract findManyLatest(params: PaginationParams): Promise<Question[]>;
}
