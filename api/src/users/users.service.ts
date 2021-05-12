import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  createUser(
    name: string,
    email: string,
    password: string,
    favoriteDish: string,
    specialDish: string,
    bio: string,
  ): User {
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
