import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';
import { RolePermission } from './role_permissions.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('role-permissions')
@UseGuards(JwtAuthGuard) 
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Get()
  findAll(@Request() req): Promise<RolePermission[]> {
    const { user } = req;

    if (!user.roles.includes('Super Admin')) {
      throw new ForbiddenException('Access denied.');
    }

    return this.rolePermissionsService.findAll();
  }

  @Get(':roleId')
  findByRole(@Request() req, @Param('roleId') roleId: number): Promise<RolePermission[]> {
    const { user } = req;

    if (!user.roles.includes('Super Admin')) {
      throw new ForbiddenException('Access denied.');
    }

    return this.rolePermissionsService.findByRole(roleId);
  }

  @Post()
  assignPermission(@Request() req, @Body() rolePermissionData: RolePermission): Promise<RolePermission> {
    const { user } = req;

    if (!user.roles.includes('Super Admin')) {
      throw new ForbiddenException('Access denied.');
    }

    return this.rolePermissionsService.assignPermission(rolePermissionData);
  }

  @Delete(':roleId/:permissionId')
  remove(@Request() req, @Param('roleId') roleId: number, @Param('permissionId') permissionId: number): Promise<void> {
    const { user } = req;

    if (!user.roles.includes('Super Admin')) {
      throw new ForbiddenException('Access denied.');
    }

    return this.rolePermissionsService.remove(roleId, permissionId);
  }
}
