import { Controller, Get, Post, Delete, Body, Request, UnauthorizedException, ForbiddenException, BadRequestException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserRolesService } from './user_roles.service';
import { UserRole } from './user_roles.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RemoveRoleDto } from './dto/remove-role.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('user-roles')
@UseGuards(JwtAuthGuard) 
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get()
  async findAll(@Request() req): Promise<UserRole[]> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canEditCompanyUsers = user.permissions.includes('edit_company_users');
  
    if (!isSuperAdmin && !canEditCompanyUsers) {
      throw new UnauthorizedException('Access denied.');
    }
  
    if (isSuperAdmin) {
      return this.userRolesService.findAll();
    }
  
    return this.userRolesService.findAllByCompany(user.dispatch_c_id);
  }
  

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async assignRole(@Request() req, @Body() assignRoleDto: AssignRoleDto): Promise<UserRole> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canEditCompanyUsers = user.permissions.includes('edit_company_users');

    if (!isSuperAdmin && !canEditCompanyUsers) {
      throw new UnauthorizedException('Access denied.');
    }
  
    if (assignRoleDto.role_id === 1) {
      throw new ForbiddenException('Access denied.');
    }
  
    if (!isSuperAdmin) {
      const targetUser = await this.userRolesService.getUserWithCompany(assignRoleDto.user_id);
      if (!targetUser || targetUser.dispatch_c_id !== user.dispatch_c_id) {
        throw new ForbiddenException('You can only modify roles for users within your company.');
      }
    }
  
    const assignedUser = await this.userRolesService.getUserById(assignRoleDto.user_id);
    const assignedRole = await this.userRolesService.getRoleById(assignRoleDto.role_id);
  
    if (!assignedUser) {
      throw new BadRequestException('User does not exist.');
    }
  
    if (!assignedRole) {
      throw new BadRequestException('Role does not exist.');
    }
  
    const userRole = new UserRole();
    userRole.user = assignedUser;
    userRole.role = assignedRole;
  
    return this.userRolesService.assignRole(userRole); 
  }
  

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Delete()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async remove(@Request() req, @Body() removeRoleDto: RemoveRoleDto): Promise<void> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canEditCompanyUsers = user.permissions.includes('edit_company_users');

    if (!isSuperAdmin && !canEditCompanyUsers) {
      throw new UnauthorizedException('Access denied.');
    }

    if (removeRoleDto.role_id === 1) {
      throw new ForbiddenException('Access Denied.');
    }

    if (!isSuperAdmin) {
      const targetUser = await this.userRolesService.getUserWithCompany(removeRoleDto.user_id);
      if (!targetUser || targetUser.dispatch_c_id !== user.dispatch_c_id) {
        throw new ForbiddenException('You can only modify roles for users within your company.');
      }
    }

    return this.userRolesService.remove(removeRoleDto.user_id, removeRoleDto.role_id);
  }
}
