import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, User as UserModel } from '@prisma/client';
import { CreateUserDTO } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { MailService } from 'src/mail/mail.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private mailService: MailService,
  ) {}
  @Post()
  async signupUser(@Body() userData: CreateUserDTO): Promise<UserModel> {
    return await this.userService.createUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.moderator)
  @Get('/:query')
  async getUser(@Param() query: { query: string }) {
    const user = await this.userService.getOneUser(query.query);
    if (user) {
      await this.mailService.sendWellcomeEmail(user);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.moderator)
  @Delete('/:id')
  async deleteuser(@Param() query: { id: string }) {
    return await this.userService.deleteUser(Number(query.id));
  }
}
