import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from './role_permissions.entity';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionsRepository: Repository<RolePermission>,
  ) {}

  // ✅ Get all role-permission mappings
  findAll(): Promise<RolePermission[]> {
    return this.rolePermissionsRepository.find();
  }

  // ✅ Get all permissions for a specific role
  async findByRole(roleId: number): Promise<RolePermission[]> {
    return this.rolePermissionsRepository.find({ where: { role_id: roleId } });
  }

  // ✅ Assign a permission to a role
  assignPermission(rolePermissionData: RolePermission): Promise<RolePermission> {
    return this.rolePermissionsRepository.save(rolePermissionData);
  }

  // ✅ Remove a permission from a role
  async remove(roleId: number, permissionId: number): Promise<void> {
    const rolePermission = await this.rolePermissionsRepository.findOne({
      where: { role_id: roleId, permission_id: permissionId },
    });

    if (!rolePermission) {
      throw new NotFoundException(
        `Permission ${permissionId} not found for Role ${roleId}`,
      );
    }

    await this.rolePermissionsRepository.remove(rolePermission);
  }
}
