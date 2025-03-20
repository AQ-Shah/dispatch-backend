import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermission } from './user_permissions.entity';
import { User } from '../users/users.entity';
import { Permission } from '../permissions/permissions.entity';
import { Role } from '../roles/roles.entity';


@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(UserPermission)
    private userPermissionsRepo: Repository<UserPermission>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Permission)
    private permissionsRepo: Repository<Permission>,
    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
  ) {}

  async assignPermission(userId: number, permissionId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const permission = await this.permissionsRepo.findOne({ where: { id: permissionId } });

    if (!permission) {
      throw new NotFoundException(`Invalid Permission`);
    } 
    if (!user) {
      throw new NotFoundException(`Invalid User`);
    }

    const existingPermission = await this.userPermissionsRepo.findOne({
      where: { user_id: userId, permission_id: permissionId },
    });
  
    if (existingPermission) {
      throw new BadRequestException(`User already has this permission.`);
    }
  

    const newUserPermission =  this.userPermissionsRepo.create({ user_id: userId, permission_id: permissionId });
    return await this.userPermissionsRepo.save(newUserPermission);
  }

  async removePermission(userId: number, permissionId: number): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const permission = await this.permissionsRepo.findOne({ where: { id: permissionId } });

    if (!permission) {
      throw new NotFoundException(`Invalid Permission`);
    }
    if (!user) {
      throw new NotFoundException(`Invalid User`);
    }

    await this.userPermissionsRepo.delete({ user_id: userId, permission_id: permissionId });
  }

  async getUserPermissions(userId: number) {
    return this.userPermissionsRepo.find({ where: { user_id: userId }, relations: ['permission'] });
  }

  async assignDefaultPermissions(userId: number, roleId: number) {
    const role = await this.rolesRepo.findOne({ where: { id: roleId }, relations: ['permissions'] });
    if (!role) throw new Error('Invalid role');

    const defaultPermissions = role.permissions;
    const userPermissions = defaultPermissions.map((perm) => ({ user_id: userId, permission_id: perm.id }));
    return this.userPermissionsRepo.save(userPermissions);
  }

  async getUserCompanyId(userId: number): Promise<{ company_id: number } | null> {
    const result = await this.usersRepo
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .select(['user.company_id'])
      .getRawOne();
  
    return result || null;
  }
  
}