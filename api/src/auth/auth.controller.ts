import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from './auth.service';
import { GetUser } from '../users/get-user.decorator';
import { UserInfo } from './type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAuthUser(@GetUser() user: UserInfo): Promise<any> {
    return this.authService.getAuthUser(user);
  }
}
