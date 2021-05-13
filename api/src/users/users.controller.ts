import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './user.model';
import { UserRoleValidationPipe } from './pipes/user-role-validation.pipe';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): User[] {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id') id: number): User {
    return this.usersService.getUserById(id);
  }

  @Post('/register/admin')
  registerAdmin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersService.registerAdmin(authCredentialsDto);
  }

  @Post('/register')
  register(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersService.register(authCredentialsDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): void {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id/role')
  updateUserRole(
    @Param('id') id: number,
    @Body('role', UserRoleValidationPipe) role: UserRole,
  ) {
    return this.usersService.updateUserRole(id, role);
  }
}
