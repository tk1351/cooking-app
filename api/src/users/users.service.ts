import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './users.repository';
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
import { UserInfo } from '../auth/type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private socialsService: SocialsService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
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

  async getUserBySub(sub: string): Promise<User> {
    return await this.userRepository.getUserBySub(sub);
  }

  async getAuthorById(id: number): Promise<User> {
    return await this.userRepository.getAuthorById(id);
  }

  async registerAdmin(createUserDto: CreateUserDto): Promise<MyKnownMessage> {
    return this.userRepository.registerAdmin(createUserDto);
  }

  async register(createUserDto: CreateUserDto): Promise<MyKnownMessage> {
    return this.userRepository.register(createUserDto);
  }

  async updateAdminProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
    user: UserInfo,
  ): Promise<User> {
    const found = await this.getUserById(id);

    if (found.sub !== user.sub) {
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
    user: UserInfo,
  ): Promise<User> {
    const found = await this.getUserById(id);

    if (found.sub !== user.sub) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    const { name, specialDish, favoriteDish } = updateUserProfileDto;

    found.name = name;
    found.specialDish = specialDish;
    found.favoriteDish = favoriteDish;

    const newUser = await this.userRepository.save(found);
    return newUser;
  }

  async deleteUser(id: number, user: UserInfo): Promise<MyKnownMessage> {
    return await this.userRepository.deleteUser(id, user);
  }

  // adminのみが全てのユーザーの削除権限あり
  async deleteUserByAdmin(id: number, user: UserInfo): Promise<MyKnownMessage> {
    return await this.userRepository.deleteUserByAdmin(id, user);
  }
}
