import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../users/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      return false;
    }

    request.user = user; // 将用户信息附加到 request 对象上
    return true;
  }
}
