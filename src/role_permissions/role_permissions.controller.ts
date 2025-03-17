import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';
import { RolePermission } from './role_permissions.entity';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Get()
  findAll(): Promise<RolePermission[]> {
    return this.rolePermissionsService.findAll();
  }

  @Get(':roleId')
  findByRole(@Param('roleId') roleId: number): Promise<RolePermission[]> {
    return this.rolePermissionsService.findByRole(roleId);
  }

  @Post()
  assignPermission(@Body() rolePermissionData: RolePermission): Promise<RolePermission> {
    return this.rolePermissionsService.assignPermission(rolePermissionData);
  }

  @Delete(':roleId/:permissionId')
  remove(@Param('roleId') roleId: number, @Param('permissionId') permissionId: number): Promise<void> {
    return this.rolePermissionsService.remove(roleId, permissionId);
  }
}
