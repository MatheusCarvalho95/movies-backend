import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
