import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Session } from './jwt.interfaces';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  getAuthenticateOptions(): IAuthModuleOptions {
    return {
      property: 'session',
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const {
      session: { user },
    }: { session: Session } = context.switchToHttp().getRequest();

    if (!user) return false;

    return requiredRoles.includes(user.type);
  }
}
