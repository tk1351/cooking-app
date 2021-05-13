import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async registerAdmin(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.registerAdmin(authCredentialsDto);
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.register(authCredentialsDto);
  }

  // 一旦booleanを返す
  async login(authCredentialsDto: AuthCredentialsDto): Promise<boolean> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('認証情報が無効です');
    }
    return true;
    // jwtを返す記述を書く
  }
}
