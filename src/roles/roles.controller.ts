import { Controller, Get, Post, Delete, Body, Param, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './roles.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard) 
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(@Request() req): Promise<Role[]> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canViewRoles = user.permissions.includes('can_view_permission');

    if (!isSuperAdmin && !canViewRoles) {
      throw new UnauthorizedException('Access denied.');
    }

    if (!isSuperAdmin) {
      return this.rolesService.findAllExcludingSuperAdmin();
    }

    return this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Role> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canViewRoles = user.permissions.includes('can_view_permission');

    if (!isSuperAdmin && !canViewRoles) {
      throw new UnauthorizedException('Access denied.');
    }

    if (!isSuperAdmin && id === 1) {
      throw new UnauthorizedException('Access denied.');
    }

    return this.rolesService.findOne(id);
  }

  @Post()
  async create(@Request() req, @Body() roleData: Role): Promise<Role> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    if (!isSuperAdmin) {
      throw new UnauthorizedException('Unauthorized access.');
    }

    return this.rolesService.create(roleData);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number): Promise<void> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    if (!isSuperAdmin) {
      throw new UnauthorizedException('Unauthorized access.');
    } 

    return this.rolesService.remove(id);
  }
}
