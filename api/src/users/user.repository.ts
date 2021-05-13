import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRole } from './user.model';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async registerAdmin(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { name, email, password } = authCredentialsDto;

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = UserRole.admin;
    user.favoriteDish = '';
    user.specialDish = '';
    user.bio = '';

    try {
      await user.save();
    } catch (error) {
      // userのemailが重複している場合
      if (error.code === '23505') {
        throw new ConflictException('このメールアドレスは既に登録されています');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { name, email, password } = authCredentialsDto;

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = UserRole.auth;
    user.favoriteDish = '';
    user.specialDish = '';
    user.bio = '';

    try {
      await user.save();
    } catch (error) {
      // userのemailが重複している場合
      if (error.code === '23505') {
        throw new ConflictException('このメールアドレスは既に登録されています');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
