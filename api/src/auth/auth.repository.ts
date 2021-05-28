import { EntityRepository, Repository } from 'typeorm';
import { User } from '../users/users.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async getAuthUser(user: User): Promise<User> {
    const found = await this.findOne(
      { id: user.id },
      { select: ['id', 'name', 'role'] },
    );

    return found;
  }
}
