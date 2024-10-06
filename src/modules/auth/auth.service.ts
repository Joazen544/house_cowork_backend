import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from '../users/entities/user.entity';
import { EmailInUseException } from '../../common/exceptions/auth/email-in-use.exception';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string, name: string, nickName: string) {
    const users = await this.usersService.find(email);
    if (users && users.length) {
      throw new EmailInUseException();
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result, name, nickName);

    return { user, accessToken: await this.signJwt(user) };
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return { user, accessToken: await this.signJwt(user) };
  }

  private async signJwt(user: User) {
    const payload = { sub: user.id, username: user.name };
    return await this.jwtService.signAsync(payload);
  }

  async validateToken(token: string) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException();
    }
    const user = this.usersService.findOne({ id: payload.sub });
    return user;
  }
}
