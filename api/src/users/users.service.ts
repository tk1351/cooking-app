import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MyKnownMessage } from '../message.interface';
import { RecipeLike } from '../recipe-likes/recipe-like.entity';
import { RecipeLikesService } from '../recipe-likes/recipe-likes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private recipeLikesService: RecipeLikesService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      const result = await this.userRepository.find({});
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    return user;
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
  ): Promise<User> {
    const found = await this.getUserById(id);

    if (found.id !== user.id) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    const { name, specialDish, favoriteDish, bio } = updateProfileDto;

    found.name = name;
    found.specialDish = specialDish;
    found.favoriteDish = favoriteDish;
    found.bio = bio;

    await found.save();
    return found;
  }

  async deleteUser(id: number, user: User): Promise<MyKnownMessage> {
    const found = await this.getUserById(id);
    if (found.id !== user.id) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    // userIdが一致するお気に入りを取得
    const recipeLikesIndex: RecipeLike[] =
      await this.recipeLikesService.getRecipeLikesByUserId(user.id);

    // recipeLikesIndexをmapして、IDが一致するお気に入りを削除する
    recipeLikesIndex.map((index) =>
      this.recipeLikesService.deleteRecipeLikes(index.id),
    );

    const result = await this.userRepository.delete({ id });

    // DeleteResultのaffectedが0 = 削除できるものが存在しない
    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のuserは存在しません`);
    }

    return { message: 'ユーザーを削除しました' };
  }

  // adminのみが全てのユーザーの削除権限あり
  async deleteUserByAdmin(id: number, user: User): Promise<MyKnownMessage> {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('管理者権限がありません');
    }

    // userIdが一致するお気に入りを取得
    const recipeLikesIndex: RecipeLike[] =
      await this.recipeLikesService.getRecipeLikesByUserId(id);

    // recipeLikesIndexをmapして、IDが一致するお気に入りを削除する
    recipeLikesIndex.map((index) =>
      this.recipeLikesService.deleteRecipeLikes(index.id),
    );

    const result = await this.userRepository.delete({ id });

    // DeleteResultのaffectedが0 = 削除できるものが存在しない
    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のuserは存在しません`);
    }

    return { message: 'ユーザーを削除しました' };
  }
}
