import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { GetUser } from 'src/auth/session.decorators';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Get('confirm/:token')
  async confirmEmail(@Param('token') token: string) {
    return await this.mailService.confirmEmail(token);
  }
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.moderator, Role.user)
  @Post('initiate-reset-password')
  async initiateResetPassword(@GetUser() user: User) {
    return await this.mailService.initiateResetPassword(user);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() { password }: { password: string },
  ) {
    return await this.mailService.resetPassword(token, password);
  }
}
