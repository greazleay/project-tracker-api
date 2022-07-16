import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../../auth/interfaces/auth.interface';

export const UserDecorator = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);