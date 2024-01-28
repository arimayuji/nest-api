import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";
import { Encrypter } from "@/domain/forum/application/cryptography/encrypt";
import { HashComparer } from "@/domain/forum/application/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

@Module({
	providers: [
		{
			provide: Encrypter,
			useClass: JwtEncrypter,
		},
		{
			provide: HashComparer,
			useClass: BcryptHasher,
		},
		{
			provide: HashGenerator,
			useClass: BcryptHasher,
		},
	],
	exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptoGraphyModule {}
