import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './users.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MyKnownMessage } from '../message.interface';
import { SocialsService } from '../socials/socials.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private socialsService: SocialsService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.getUserById(id);
  }

  async registerAdmin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<MyKnownMessage> {
    return this.userRepository.registerAdmin(authCredentialsDto);
  }

  async register(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<MyKnownMessage> {
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

  async updateUserProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
    user: User,
  ): Promise<any> {
    const found = await this.getUserById(id);

    if (found.id !== user.id) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    const { name, specialDish, favoriteDish, bio, socials } = updateProfileDto;

    found.name = name;
    found.specialDish = specialDish;
    found.favoriteDish = favoriteDish;
    found.bio = bio;

    await this.socialsService.deleteSocialsByUserId(id);

    const createSocialsDtos = socials.map((social) => {
      return { ...social, user: found };
    });

    const newSocials = await this.socialsService.createSocials(
      createSocialsDtos,
    );

    found.socials = newSocials;

    const newUser = await this.userRepository.save(found);
    return newUser;
  }

  async deleteUser(id: number, user: User): Promise<MyKnownMessage> {
    return await this.userRepository.deleteUser(id, user);
  }

  // adminのみが全てのユーザーの削除権限あり
  async deleteUserByAdmin(id: number, user: User): Promise<MyKnownMessage> {
    return await this.userRepository.deleteUserByAdmin(id, user);
  }
}
