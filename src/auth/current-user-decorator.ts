import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { TokenPayload } from "./auth.strategy";

export const CurrentUser = createParamDecorator(
	(_: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();

		return request.user as TokenPayload;
	}
);
