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
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './users.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from './get-user.decorator';
import { MyKnownMessage } from '../message.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

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
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<MyKnownMessage> {
    return this.usersService.registerAdmin(createUserDto);
  }

  @Post('/register')
  register(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<MyKnownMessage> {
    return this.usersService.register(createUserDto);
  }

  @Post('/login')
  login(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.usersService.login(authCredentialsDto);
  }

  @Patch('/admin/:id/profile')
  @UseGuards(AuthGuard())
  updateAdminProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.updateAdminProfile(id, updateProfileDto, user);
  }

  @Patch('/user/:id/profile')
  @UseGuards(AuthGuard())
  updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserProfileDto: UpdateUserProfileDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.updateUserProfile(id, updateUserProfileDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<MyKnownMessage> {
    return this.usersService.deleteUser(id, user);
  }

  @Delete('/:id/admin')
  @UseGuards(AuthGuard())
  deleteUserByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<MyKnownMessage> {
    return this.usersService.deleteUserByAdmin(id, user);
  }
}
