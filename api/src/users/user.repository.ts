import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRole } from './user.model';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async registerAdmin(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    const user = new User();
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
    const { email, password } = authCredentialsDto;

    const user = new User();
    user.name = '';
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
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

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { email, password } = authCredentialsDto;
    const user = await this.findOne({ email });

    console.log('validateUserPassword', user);

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
}
