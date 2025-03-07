import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './user_roles.entity';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
  ) {}

  findAll(): Promise<UserRole[]> {
    return this.userRolesRepository.find();
  }

  findByUser(userId: number): Promise<UserRole[]> {
    return this.userRolesRepository.find({ where: { user_id: userId } });
  }

  assignRole(userRoleData: UserRole): Promise<UserRole> {
    return this.userRolesRepository.save(userRoleData);
  }

  async remove(userId: number, roleId: number): Promise<void> {
    await this.userRolesRepository.delete({ user_id: userId, role_id: roleId });
  }
}
