import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User {
    const found = this.users.find((user) => user.id == id);

    if (!found) {
      throw new NotFoundException(`ID: ${id} のユーザーは存在しません`);
    }
    return found;
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
      role: UserRole.auth,
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
    const found = this.getUserById(id);
    this.users = this.users.filter((user) => user.id != found.id);
  }

  updateUserRole(id: number, role: UserRole): User {
    const user = this.getUserById(id);
    user.role = role;
    return user;
  }
}
