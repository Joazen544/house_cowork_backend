import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from '../users/entities/user.entity';
import { EmailInUseException } from '../../common/exceptions/auth/email-in-use.exception';
import { WrongPasswordException } from '../../common/exceptions/auth/wrong-password.exception';
import { EmailNotFoundException } from '../../common/exceptions/auth/email-not-found.exception';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string, name: string) {
    const users = await this.usersService.findByEmail(email);
    if (users && users.length) {
      throw new EmailInUseException();
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result, name);

    return { user, accessToken: await this.signJwt(user) };
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      throw new EmailNotFoundException();
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new WrongPasswordException();
    }

    return { user, accessToken: await this.signJwt(user) };
  }

  private async signJwt(user: User) {
    const payload = { sub: user.id, username: user.name };
    return await this.jwtService.signAsync(payload);
  }

  async validateToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token);

    const user = this.usersService.findOneBy({ id: payload.sub });
    return user;
  }
}
