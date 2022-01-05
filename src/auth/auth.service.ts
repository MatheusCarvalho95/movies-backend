import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userInput: { userNameOrEmail: string; password: string }) {
    const user = await this.userService.getOneUser(userInput.userNameOrEmail);

    if (user && !!argon2.verify(user.password, userInput.password)) {
      delete user.password;
      return user;
    } else {
      return null;
    }
  }

  async login(user: User) {
    const payload = { userName: user.userName, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      userName: user.userName,
      confirmedEmail: user.confirmedEmail,
    };
  }
}