import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.model';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

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

  async registerAdmin(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.registerAdmin(authCredentialsDto);
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.register(authCredentialsDto);
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
