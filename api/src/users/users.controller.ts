import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoleValidationPipe } from './pipes/user-role-validation.pipe';

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

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.createUser(createUserDto);
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
