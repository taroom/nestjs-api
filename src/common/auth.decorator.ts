import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user; //user di dapat dari middleware

    if (user) {
      return user;
    } else {
      throw new HttpException('Un-authorized', 401);
    }
  },
);
