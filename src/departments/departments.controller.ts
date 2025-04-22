import { Controller, Get, Post, Delete, Body, Param,Request,UsePipes, ValidationPipe,  UseGuards, ForbiddenException, Put, Req} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './departments.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 
import { Throttle } from '@nestjs/throttler';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async create(@Request() req, @Body() CreateDepartmentDto: CreateDepartmentDto) {
      const { user } = req;
      const isSuperAdmin = user.roles.includes('Super Admin');
      const hasCompanyPermission = user.permissions.includes('manage_company_departments');

      if (!isSuperAdmin && !hasCompanyPermission) {
        throw new ForbiddenException('You do not have permission to create departments.');
      }

      if (!isSuperAdmin) {
        if (!CreateDepartmentDto.dispatch_c_id || CreateDepartmentDto.dispatch_c_id !== user.dispatch_c_id) {
          throw new ForbiddenException('You can only create departments within your company.');
        }
      }

      return this.departmentsService.create(CreateDepartmentDto);
    }

  @Get()
  findAll(@Request() req): Promise<Department[]> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const hasCompanyPermission = user.permissions.includes('manage_company_departments');

    if (!isSuperAdmin && !hasCompanyPermission) {
      throw new ForbiddenException('You do not have permission to view departments.');
    }

    if (!isSuperAdmin) {
      return this.departmentsService.findDepartmentsByCompany(user.dispatch_c_id);
    }

    return this.departmentsService.findAll();
    
  }

  @Get(':id')
  async findOne(@Request() req,@Param('id') id: number): Promise<Department> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const hasCompanyPermission = user.permissions.includes('manage_company_departments');

    const foundDepartment = await this.departmentsService.findOne(id);

    if (!isSuperAdmin && !hasCompanyPermission) {
      throw new ForbiddenException('You do not have permission to view departments.');
    }

    if (!isSuperAdmin) {
      if (foundDepartment.company.id !== user.dispatch_c_id) {
        throw new ForbiddenException('You can only view departments within your company.');
      }
    }

    return foundDepartment;
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) : Promise<Department> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const hasCompanyPermission = user.permissions.includes('manage_company_departments');

    if (!isSuperAdmin && !hasCompanyPermission) {
      throw new ForbiddenException('You do not have permission to update departments.');
    }

    const departmentToUpdate = await this.departmentsService.findOne(id);

    if (!isSuperAdmin) {
      if (departmentToUpdate.company.id !== user.dispatch_c_id) {
        throw new ForbiddenException('You can only update departments within your company.');
      }
    }

    await this.departmentsService.update(id, updateDepartmentDto);
    return this.departmentsService.findOne(id);
  }

  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @Delete(':id')
  async remove(@Request() req,@Param('id') id: number): Promise<void> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const hasCompanyPermission = user.permissions.includes('manage_company_departments');

    if (!isSuperAdmin && !hasCompanyPermission) {
      throw new ForbiddenException('You do not have permission to delete departments.');
    }

    const departmentToDelete = await this.departmentsService.findOne(id);

    if (!isSuperAdmin) {
      if (departmentToDelete.company.id !== user.dispatch_c_id) {
        throw new ForbiddenException('You can only delete departments within your company.');
      }
    }

    return this.departmentsService.remove(id);
  }
}


