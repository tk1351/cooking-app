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
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from './get-user.decorator';
import { MyKnownMessage } from '../message.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserInfo } from '../auth/type';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(
    @Query(ValidationPipe) getUsersDto: GetUsersDto,
  ): Promise<[User[], number]> {
    return this.usersService.getUsers(getUsersDto);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Get('/auth0/:sub')
  getUserBySub(@Param('sub', ValidationPipe) sub: string): Promise<User> {
    return this.usersService.getUserBySub(sub);
  }

  @Get('/author/:id')
  getAuthorById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getAuthorById(id);
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

  @Patch('/admin/:id/profile')
  @UseGuards(AuthGuard)
  updateAdminProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
    @GetUser() user: UserInfo,
  ): Promise<User> {
    return this.usersService.updateAdminProfile(id, updateProfileDto, user);
  }

  @Patch('/user/:id/profile')
  @UseGuards(AuthGuard)
  updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserProfileDto: UpdateUserProfileDto,
    @GetUser() user: UserInfo,
  ): Promise<User> {
    return this.usersService.updateUserProfile(id, updateUserProfileDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserInfo,
  ): Promise<MyKnownMessage> {
    return this.usersService.deleteUser(id, user);
  }

  @Delete('/:id/admin')
  @UseGuards(AuthGuard)
  deleteUserByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserInfo,
  ): Promise<MyKnownMessage> {
    return this.usersService.deleteUserByAdmin(id, user);
  }
}
