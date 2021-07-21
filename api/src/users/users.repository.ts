import { Repository, EntityRepository, getCustomRepository } from 'typeorm';
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
import {
  GetUsersByLimitNumberDto,
  GetUsersByOffsetDto,
} from './dto/get-users.dto';
import { RecipeLikeRepository } from '../recipe-likes/recipe-likes.repository';
import { SocialsRepository } from '../socials/socials.repository';
import { RecipeLike } from '../recipe-likes/recipe-likes.entity';
import { Social } from '../socials/socials.entity';
import { UserInfo } from '../auth/type';

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

  async getUsersByLimitNumber(
    getUsersByLimitNumberDto: GetUsersByLimitNumberDto,
  ): Promise<User[]> {
    const { limit } = getUsersByLimitNumberDto;

    const result = this.createQueryBuilder('users')
      .leftJoinAndSelect('users.socials', 'socials')
      .take(limit);

    try {
      const users = await result.getMany();
      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUsersByOffset(
    getUsersByOffsetDto: GetUsersByOffsetDto,
  ): Promise<User[]> {
    const { limit, start } = getUsersByOffsetDto;

    const result = this.createQueryBuilder('users')
      .leftJoinAndSelect('users.socials', 'socials')
      .skip(start)
      .take(limit);

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
    const recipeLikeRepository = getCustomRepository(RecipeLikeRepository);
    const socialsRepository = getCustomRepository(SocialsRepository);

    // 渡ってくるidで削除するユーザーを特定する
    const found = await this.getUserById(id);

    // 操作しているuserがfoundのユーザーでない場合はエラー
    if (found.sub !== user.sub) {
      throw new UnauthorizedException('認証情報が無効です');
    }

    // // userIdが一致するお気に入りを取得
    const recipeLikesIndex: RecipeLike[] =
      await recipeLikeRepository.getRecipeLikesByUserId(id);

    // // userIdが一致するsocialを取得
    const socialsIndex: Social[] = await socialsRepository.getSocialsByUserId(
      id,
    );

    // // recipeLikesIndexをmapして、IDが一致するお気に入りを削除する
    recipeLikesIndex.map((index) =>
      recipeLikeRepository.deleteRecipeLikes(index.id),
    );

    // // socialsIndexをmapして、IDが一致するsocialを削除する
    socialsIndex.map((index) => socialsRepository.deleteSocial(index.id));

    const result = await this.delete({ id });

    // // DeleteResultのaffectedが0 = 削除できるものが存在しない
    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のuserは存在しません`);
    }

    return { message: 'ユーザーを削除しました' };
  }

  // adminのみが全てのユーザーの削除権限あり
  async deleteUserByAdmin(id: number, user: UserInfo): Promise<MyKnownMessage> {
    const recipeLikeRepository = getCustomRepository(RecipeLikeRepository);
    const socialsRepository = getCustomRepository(SocialsRepository);

    // 操作するユーザーが管理者でない場合はエラー
    const found = await this.getUserBySub(user.sub);

    if (found.role !== 'admin') {
      throw new UnauthorizedException('管理者権限がありません');
    }

    // userIdが一致するお気に入りを取得
    const recipeLikesIndex: RecipeLike[] =
      await recipeLikeRepository.getRecipeLikesByUserId(id);

    // userIdが一致するsocialを取得
    const socialsIndex: Social[] = await socialsRepository.getSocialsByUserId(
      id,
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
