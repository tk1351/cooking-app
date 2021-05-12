import { PipeTransform, BadRequestException } from '@nestjs/common';
import { UserRole } from '../user.model';

export class UserRoleValidationPipe implements PipeTransform {
  readonly allowedRoles = [UserRole.admin, UserRole.auth];
  transform(value: UserRole) {
    if (!this.isRoleValid(value)) {
      throw new BadRequestException(`"${value}"はroleに存在しません`);
    }
    return value;
  }

  private isRoleValid(role: UserRole) {
    const index = this.allowedRoles.indexOf(role);
    return index !== -1;
  }
}
