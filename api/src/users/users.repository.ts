import { Repository, EntityRepository, getCustomRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRole } from './user.model';
import { MyKnownMessage } from '../message.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RecipeLikeRepository } from '../recipe-likes/recipe-likes.repository';
import { RecipeLike } from '../recipe-likes/recipe-likes.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getAllUsers(): Promise<User[]> {
    try {
      const result = await this.find({});
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.findOne(id);

    return user;
  }

  async registerAdmin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<MyKnownMessage> {
    const { email, password } = authCredentialsDto;

    const user = this.create();
    user.name = '';
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.role = UserRole.admin;
    user.favoriteDish = '';
    user.specialDish = '';
    user.bio = '';

    try {
      await user.save();
      return { message: 'ユーザー登録が完了しました' };
    } catch (error) {
      // userのemailが重複している場合
      if (error.code === '23505') {
        throw new ConflictException('このメールアドレスは既に登録されています');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async register(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<MyKnownMessage> {
    const { email, password } = authCredentialsDto;

    const user = this.create();
    user.name = '';
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.role = UserRole.user;
    user.favoriteDish = '';
    user.specialDish = '';
    user.bio = '';

    try {
      await user.save();
      return { message: 'ユーザー登録が完了しました' };
    } catch (error) {
      // userのemailが重複している場合
      if (error.code === '23505') {
        throw new ConflictException('このメールアドレスは既に登録されています');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { email, password } = authCredentialsDto;
    const user = await this.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return user.email;
    } else {
      return null;
    }
  }

  // passwordの暗号化
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
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
    const recipeLikeRepository = getCustomRepository(RecipeLikeRepository);

    const found = await this.getUserById(id);
    if (found.id !== user.id) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    // userIdが一致するお気に入りを取得
    const recipeLikesIndex: RecipeLike[] =
      await recipeLikeRepository.getRecipeLikesByUserId(user.id);

    // recipeLikesIndexをmapして、IDが一致するお気に入りを削除する
    recipeLikesIndex.map((index) =>
      recipeLikeRepository.deleteRecipeLikes(index.id),
    );

    const result = await this.delete({ id });

    // DeleteResultのaffectedが0 = 削除できるものが存在しない
    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のuserは存在しません`);
    }

    return { message: 'ユーザーを削除しました' };
  }

  // adminのみが全てのユーザーの削除権限あり
  async deleteUserByAdmin(id: number, user: User): Promise<MyKnownMessage> {
    const recipeLikeRepository = getCustomRepository(RecipeLikeRepository);

    if (user.role !== 'admin') {
      throw new UnauthorizedException('管理者権限がありません');
    }

    // userIdが一致するお気に入りを取得
    const recipeLikesIndex: RecipeLike[] =
      await recipeLikeRepository.getRecipeLikesByUserId(id);

    // recipeLikesIndexをmapして、IDが一致するお気に入りを削除する
    recipeLikesIndex.map((index) =>
      recipeLikeRepository.deleteRecipeLikes(index.id),
    );

    const result = await this.delete({ id });

    // DeleteResultのaffectedが0 = 削除できるものが存在しない
    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のuserは存在しません`);
    }

    return { message: 'ユーザーを削除しました' };
  }
}
