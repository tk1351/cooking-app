import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post('/register/admin')
  registerAdmin(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.usersService.registerAdmin(authCredentialsDto);
  }

  @Post('/register')
  register(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.usersService.register(authCredentialsDto);
  }

  @Post('/login')
  login(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.usersService.login(authCredentialsDto);
  }

  @Patch('/:id/profile')
  @UseGuards(AuthGuard())
  updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.updateUserProfile(id, updateProfileDto, user);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
