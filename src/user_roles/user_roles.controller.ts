import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { UserRolesService } from './user_roles.service';
import { UserRole } from './user_roles.entity';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get()
  findAll(): Promise<UserRole[]> {
    return this.userRolesService.findAll();
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: number): Promise<UserRole[]> {
    return this.userRolesService.findByUser(userId);
  }

  @Post()
  assignRole(@Body() userRoleData: UserRole): Promise<UserRole> {
    return this.userRolesService.assignRole(userRoleData);
  }

  @Delete(':userId/:roleId')
  remove(@Param('userId') userId: number, @Param('roleId') roleId: number): Promise<void> {
    return this.userRolesService.remove(userId, roleId);
  }
}
