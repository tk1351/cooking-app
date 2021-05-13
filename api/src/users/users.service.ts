import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.getUserById(id);
  }

  async registerAdmin(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.registerAdmin(authCredentialsDto);
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.register(authCredentialsDto);
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const email = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!email) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    // JWTを返す
    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  // TODO: PATCH userのプロフィールを変更
  // idからuserを特定する
  // 変更したい箇所：name, bio, specialDish, favoriteDish
  async updateUserProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.getUserById(id);
    const { name, specialDish, favoriteDish, bio } = updateProfileDto;

    user.name = name;
    user.specialDish = specialDish;
    user.favoriteDish = favoriteDish;
    user.bio = bio;

    await user.save();
    return user;
  }
}
