import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/users.entity';
import { UserInfo } from './type';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async getAuthUser(user: UserInfo): Promise<User> {
    try {
      const found = await this.findOne(
        { sub: user.sub },
        { select: ['id', 'name', 'role'] },
      );

      return found;
    } catch (e) {
      throw new NotFoundException('ユーザー情報が見つかりません');
    }
  }
}
