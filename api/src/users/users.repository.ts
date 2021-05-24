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
import { SocialsRepository } from '../socials/socials.repository';
import { Social } from '../socials/socials.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getAllUsers(): Promise<User[]> {
    const result = this.createQueryBuilder('users').leftJoinAndSelect(
      'users.socials',
      'socials',
    );

    try {
      const users = await result.getMany();
      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUserById(id: number): Promise<User> {
    const found = await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.socials', 'socials')
      .where('users.id = :id', { id })
      .getOne();

    return found;
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
    user.socials = [];

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
    user.socials = [];

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

  // async updateUserProfile(
  //   id: number,
  //   updateProfileDto: UpdateProfileDto,
  //   user: User,
  // ): Promise<User> {
  //   const found = await this.getUserById(id);

  //   if (found.id !== user.id) {
  //     throw new UnauthorizedException('認証情報が無効です');
  //   }

  //   const { name, specialDish, favoriteDish, bio } = updateProfileDto;

  //   found.name = name;
  //   found.specialDish = specialDish;
  //   found.favoriteDish = favoriteDish;
  //   found.bio = bio;

  //   await found.save();
  //   return found;
  // }

  async deleteUser(id: number, user: User): Promise<MyKnownMessage> {
    const recipeLikeRepository = getCustomRepository(RecipeLikeRepository);
    const socialsRepository = getCustomRepository(SocialsRepository);

    const found = await this.getUserById(id);
    if (found.id !== user.id) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    // userIdが一致するお気に入りを取得
    const recipeLikesIndex: RecipeLike[] =
      await recipeLikeRepository.getRecipeLikesByUserId(user.id);

    // userIdが一致するsocialを取得
    const socialsIndex: Social[] = await socialsRepository.getSocialsByUserId(
      user.id,
    );

    // recipeLikesIndexをmapして、IDが一致するお気に入りを削除する
    recipeLikesIndex.map((index) =>
      recipeLikeRepository.deleteRecipeLikes(index.id),
    );

    // socialsIndexをmapして、IDが一致するsocialを削除する
    socialsIndex.map((index) => socialsRepository.deleteSocial(index.id));

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
    const socialsRepository = getCustomRepository(SocialsRepository);

    if (user.role !== 'admin') {
      throw new UnauthorizedException('管理者権限がありません');
    }

    // userIdが一致するお気に入りを取得
    const recipeLikesIndex: RecipeLike[] =
      await recipeLikeRepository.getRecipeLikesByUserId(id);

    // userIdが一致するsocialを取得
    const socialsIndex: Social[] = await socialsRepository.getSocialsByUserId(
      user.id,
    );

    // recipeLikesIndexをmapして、IDが一致するお気に入りを削除する
    recipeLikesIndex.map((index) =>
      recipeLikeRepository.deleteRecipeLikes(index.id),
    );

    // socialsIndexをmapして、IDが一致するsocialを削除する
    socialsIndex.map((index) => socialsRepository.deleteSocial(index.id));

    const result = await this.delete({ id });

    // DeleteResultのaffectedが0 = 削除できるものが存在しない
    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のuserは存在しません`);
    }

    return { message: 'ユーザーを削除しました' };
  }
}