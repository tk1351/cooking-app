import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from '../auth/type';

// headerにある 'bearer ${token}'からuserオブジェクトだけを抽出する
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserInfo => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
