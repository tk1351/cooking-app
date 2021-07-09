import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { User } from '../users/users.entity';
import { UserInfo } from './type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
  ) {}

  async getAuthUser(user: UserInfo): Promise<User> {
    return this.authRepository.getAuthUser(user);
  }
}
