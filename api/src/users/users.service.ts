import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  createUser(createUserDto: CreateUserDto): User {
    const { name, email, password, favoriteDish, specialDish, bio } =
      createUserDto;

    const user: User = {
      id: 1,
      name,
      email,
      password,
      role: 'auth',
      favoriteDish,
      specialDish,
      bio,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }
}
