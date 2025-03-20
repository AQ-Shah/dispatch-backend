import { Controller, Post, Delete, Get, Param, UseGuards, UsePipes, ValidationPipe, Request, Body, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UserPermissionsService } from './user_permissions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { RemovePermissionDto } from './dto/remove-permission.dto';

@UseGuards(JwtAuthGuard) 
@Controller('user-permissions')
export class UserPermissionsController {
  constructor(private readonly userPermissionsService: UserPermissionsService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })  
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async assignPermission(@Request() req, @Body() assignPermissionDto: AssignPermissionDto) {
    const { userId, permissionId } = assignPermissionDto;
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canEditCompanyUsers = user.permissions.includes('edit_company_users');

    if (!isSuperAdmin && !canEditCompanyUsers) {
      throw new UnauthorizedException('Access denied.');
    }

    if (!isSuperAdmin) {
      const targetUser = await this.userPermissionsService.getUserCompanyId(userId);
      if (!targetUser || targetUser.company_id !== user.company_id) {
        throw new ForbiddenException('Access Denied.');
      }
    }

    return this.userPermissionsService.assignPermission(userId, permissionId);
  }



  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Delete()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async removePermission(@Request() req, @Body() removePermissionDto: RemovePermissionDto) {
    const { userId, permissionId } = removePermissionDto;
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canEditCompanyUsers = user.permissions.includes('edit_company_users');

    if (!isSuperAdmin && !canEditCompanyUsers) {
      throw new UnauthorizedException('Access denied.');
    }

    if (!isSuperAdmin) {
      const targetUser = await this.userPermissionsService.getUserCompanyId(userId);
      if (!targetUser || targetUser.company_id !== user.company_id) {
        throw new ForbiddenException('Access Denied.');
      }
    }

    return this.userPermissionsService.removePermission(userId, permissionId);
  }

  @Get(':userId')
  async getUserPermissions(@Param('userId') userId: number) {
    return this.userPermissionsService.getUserPermissions(userId);
  }
}
