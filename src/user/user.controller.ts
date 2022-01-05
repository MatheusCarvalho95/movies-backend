import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role, User as UserModel } from '@prisma/client';
import { CreateUserDTO } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async signupUser(@Body() userData: CreateUserDTO): Promise<UserModel> {
    return await this.userService.createUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.moderator)
  @Get('/:query')
  async getUser(@Param() query: { query: string }) {
    return await this.userService.getOneUser(query.query);
  }
}
