import { Controller, Get, Post, Delete, Body, Param, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from './permissions.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('permissions')
@UseGuards(JwtAuthGuard) 
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async findAll(@Request() req): Promise<Permission[]> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canViewPermissions = user.permissions.includes('can_view_permission');

    if (!isSuperAdmin && !canViewPermissions) {
      throw new UnauthorizedException('Access denied.');
    }

    return this.permissionsService.findAll();
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Permission> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canViewPermissions = user.permissions.includes('can_view_permission');

    if (!isSuperAdmin && !canViewPermissions) {
      throw new UnauthorizedException('Access denied.');
    }

    return this.permissionsService.findOne(id);
  }

  @Post()
  async create(@Request() req, @Body() permissionData: Permission): Promise<Permission> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    if (!isSuperAdmin) {
      throw new UnauthorizedException('Unauthorized access.');
    }

    return this.permissionsService.create(permissionData);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number): Promise<void> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    if (!isSuperAdmin) {
      throw new UnauthorizedException('Unauthorized access.');
    }

    return this.permissionsService.remove(id);
  }
}
