import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';
import { RolePermission } from './role_permissions.entity';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  // ✅ Get all role-permission mappings
  @Get()
  findAll(): Promise<RolePermission[]> {
    return this.rolePermissionsService.findAll();
  }

  // ✅ Get all permissions assigned to a specific role
  @Get(':roleId')
  findByRole(@Param('roleId') roleId: number): Promise<RolePermission[]> {
    return this.rolePermissionsService.findByRole(roleId);
  }

  // ✅ Assign a permission to a role
  @Post()
  assignPermission(@Body() rolePermissionData: RolePermission): Promise<RolePermission> {
    return this.rolePermissionsService.assignPermission(rolePermissionData);
  }

  // ✅ Remove a permission from a role
  @Delete(':roleId/:permissionId')
  remove(@Param('roleId') roleId: number, @Param('permissionId') permissionId: number): Promise<void> {
    return this.rolePermissionsService.remove(roleId, permissionId);
  }
}
