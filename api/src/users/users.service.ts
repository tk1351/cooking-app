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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  GetUsersByLimitNumberDto,
  GetUsersByOffsetDto,
} from './dto/get-users.dto';

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

  async getUsersByLimitNumber(
    getUsersByLimitNumberDto: GetUsersByLimitNumberDto,
  ): Promise<User[]> {
    return await this.userRepository.getUsersByLimitNumber(
      getUsersByLimitNumberDto,
    );
  }

  async getUsersByOffset(
    getUsersByOffsetDto: GetUsersByOffsetDto,
  ): Promise<User[]> {
    return await this.userRepository.getUsersByOffset(getUsersByOffsetDto);
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.getUserById(id);
  }

  async registerAdmin(createUserDto: CreateUserDto): Promise<MyKnownMessage> {
    return this.userRepository.registerAdmin(createUserDto);
  }

  async register(createUserDto: CreateUserDto): Promise<MyKnownMessage> {
    return this.userRepository.register(createUserDto);
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

  async updateAdminProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
    user: User,
  ): Promise<User> {
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

  async updateUserProfile(
    id: number,
    updateUserProfileDto: UpdateUserProfileDto,
    user: User,
  ): Promise<User> {
    const found = await this.getUserById(id);

    if (found.id !== user.id) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    const { name, specialDish, favoriteDish } = updateUserProfileDto;

    found.name = name;
    found.specialDish = specialDish;
    found.favoriteDish = favoriteDish;

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
