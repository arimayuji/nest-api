import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";

export interface QuestionsRepository {
	findById(id: string): Promise<Question | null>;
	create(question: Question): Promise<void>;
	findBySlug(slug: string): Promise<Question | null>;
	save(question: Question): Promise<void>;
	deleteById(question: Question): Promise<void>;
	findManyLatest(params: PaginationParams): Promise<Question[]>;
}
