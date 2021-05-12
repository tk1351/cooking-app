import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User {
    return this.users.find((user) => user.id == id);
  }

  createUser(createUserDto: CreateUserDto): User {
    const { name, email, password, favoriteDish, specialDish, bio } =
      createUserDto;

    // ランダムなidを生成
    const randomId = Math.floor(Math.random() * 101);

    const user: User = {
      id: randomId,
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

  deleteUser(id: number): void {
    this.users = this.users.filter((user) => user.id != id);
  }
}
