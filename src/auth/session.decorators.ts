import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const { session } = ctx.switchToHttp().getRequest();

    return session?.user;
  },
);
