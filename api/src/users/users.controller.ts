import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): User[] {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('favoriteDish') favoriteDish: string,
    @Body('specialDish') specialDish: string,
    @Body('bio') bio: string,
  ): User {
    return this.usersService.createUser(
      name,
      email,
      password,
      favoriteDish,
      specialDish,
      bio,
    );
  }
}
