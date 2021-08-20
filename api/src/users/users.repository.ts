import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './users.entity';
import { UserRole } from './user.model';
import { MyKnownMessage } from '../message.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UserInfo } from '../auth/type';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUsers(getUsersDto: GetUsersDto): Promise<[User[], number]> {
    const { start, limit } = getUsersDto;

    const result = this.createQueryBuilder('users')
      .leftJoinAndSelect('users.socials', 'socials')
      .take(limit)
      .skip(start)
      .getManyAndCount();

    try {
      return result;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getUserById(id: number): Promise<User> {
    const found = await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.socials', 'socials')
      .leftJoinAndSelect('users.recipeLikes', 'recipeLikes')
      .leftJoinAndSelect('recipeLikes.recipe', 'recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipe.tags', 'tags')
      .where('users.id = :id', { id })
      .getOne();

    return found;
  }

  async getUserBySub(sub: string): Promise<User> {
    const found = await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.socials', 'socials')
      .leftJoinAndSelect('users.recipeLikes', 'recipeLikes')
      .leftJoinAndSelect('recipeLikes.recipe', 'recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipe.tags', 'tags')
      .where('users.sub = :sub', { sub })
      .getOne();

    return found;
  }

  async getAuthorById(id: number): Promise<User> {
    const found = await this.createQueryBuilder('users')
      .leftJoinAndSelect('users.socials', 'socials')
      .where('users.id = :id', { id })
      .getOne();

    if (found === undefined) {
      throw new NotFoundException('userが存在しません');
    }

    if (found.role === 'user') {
      throw new BadRequestException('管理者ではありません');
    }

    return found;
  }

  async registerAdmin(createUserDto: CreateUserDto): Promise<MyKnownMessage> {
    const { name, email, sub, picture } = createUserDto;

    const user = this.create();
    user.name = name;
    user.email = email;
    user.sub = sub;
    user.picture = picture;
    user.role = UserRole.admin;
    user.bio = '';
    user.favoriteDish = '';
    user.specialDish = '';
    user.socials = [];

    try {
      await user.save();
      return { message: '管理者登録が完了しました' };
    } catch (error) {
      // userのemailが重複している場合
      if (error.code === '23505') {
        throw new ConflictException('このメールアドレスは既に登録されています');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async register(createUserDto: CreateUserDto): Promise<MyKnownMessage> {
    const { name, email, sub, picture } = createUserDto;

    const user = this.create();
    user.name = name;
    user.email = email;
    user.sub = sub;
    user.picture = picture;
    user.role = UserRole.user;
    user.bio = '';
    user.favoriteDish = '';
    user.specialDish = '';
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

  async deleteUser(id: number, user: UserInfo): Promise<MyKnownMessage> {
    // 渡ってくるidで削除するユーザーを特定する
    const found = await this.getUserById(id);

    // 操作しているuserがfoundのユーザーでない場合はエラー
    if (found.sub !== user.sub) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    if (!found) throw new NotFoundException(`ID: ${id}のuserは存在しません`);

    found.recipeLikes = [];
    found.socials = [];

    await this.save(found);

    await this.delete({ id });

    return { message: 'ユーザーを削除しました' };
  }

  // adminのみが全てのユーザーの削除権限あり
  async deleteUserByAdmin(id: number, user: UserInfo): Promise<MyKnownMessage> {
    // 操作するユーザーが管理者でない場合はエラー
    const admin = await this.getUserBySub(user.sub);

    if (admin.role !== 'admin') {
      throw new UnauthorizedException('管理者権限がありません');
    }

    const found = await this.getUserById(id);

    if (!found) throw new NotFoundException(`ID: ${id}のuserは存在しません`);

    found.recipeLikes = [];
    found.socials = [];

    await this.save(found);

    await this.delete({ id });

    return { message: 'ユーザーを削除しました' };
  }
}
