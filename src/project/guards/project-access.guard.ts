import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectAccess } from '../interfaces/project.interface';
import { PROJECT_ACCESS_KEY } from '../decorators/project-access.decorator';
import { RequestWithUser } from 'src/auth/interfaces/auth.interface';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<ProjectAccess>(PROJECT_ACCESS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) return true;
        const { user } = context.switchToHttp().getRequest<RequestWithUser>();
        return requiredRoles === user.projectAccessType;
    }
}