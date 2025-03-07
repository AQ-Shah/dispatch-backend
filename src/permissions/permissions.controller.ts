import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from './permissions.entity';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Permission> {
    return this.permissionsService.findOne(id);
  }

  @Post()
  create(@Body() permissionData: Permission): Promise<Permission> {
    return this.permissionsService.create(permissionData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.permissionsService.remove(id);
  }
}
