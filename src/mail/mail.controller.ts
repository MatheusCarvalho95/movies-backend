import { Controller, Get, Param } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}
  @Get('confirm/:token')
  async confirmEmail(@Param('token') token: string) {
    return await this.mailService.confirmEmail(token);
  }
}
