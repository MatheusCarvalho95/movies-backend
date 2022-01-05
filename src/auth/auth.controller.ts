import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local.guard';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
