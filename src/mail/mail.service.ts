import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload } from 'src/auth/jwt.interfaces';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async sendWellcomeEmail(user: User) {
    const payload: JwtPayload = { userName: user.userName, sub: user.id };

    return await this.mailerService.sendMail({
      to: user.email,
      from: 'somemail@some.com>',
      subject: 'Welcome to Movies!',
      html: `<h1>Welcome to Movies!</h1> <p>Please click <a href="${
        process.env.API_PATH
      }/mail/confirm/${this.jwtService.sign(
        payload,
      )}" target="_blank" >here</a> to confirm your email!</p>`,
    });
  }

  async validateToken(token: string): Promise<JwtPayload> {
    const payload = this.jwtService.decode(token);

    if (!payload) {
      throw new BadRequestException('Invalid token');
    }

    let isValid;

    try {
      isValid = await this.jwtService.verify(token);
      return isValid;
    } catch (err) {
      throw new BadRequestException('Expired token');
    }
  }

  async confirmEmail(token: string) {
    const validToken = await this.validateToken(token);
    await this.userService.updateUser({
      data: { confirmedEmail: true },
      where: { id: validToken.sub },
    });

    return 'Email confirmed!';
  }

  async initiateResetPassword(user: User) {
    const payload: JwtPayload = { userName: user.userName, sub: user.id };

    await this.mailerService.sendMail({
      to: user.email,
      from: 'somemail@some.com>',
      subject: 'Movies password reset',
      html: `<h1>Forgot your password?</h1> <p>Please click <a href="${
        process.env.API_PATH
      }/new-password/${this.jwtService.sign(
        payload,
      )}" target="_blank" >here</a> to reset your password</p>`,
    });

    return 'Check your email';
  }

  async resetPassword(token: string, password: string) {
    const validToken = await this.validateToken(token);
    await this.userService.updatePassword(validToken.sub, password);
    return 'Password updated!';
  }
}
