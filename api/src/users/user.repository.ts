import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRole } from './user.model';

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

    await user.save();
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

    await user.save();
  }
}
