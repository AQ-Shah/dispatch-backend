import { Controller, Get, Post, Delete, Body, Param,Request,UsePipes, ValidationPipe,  UseGuards, ForbiddenException, Put, Req} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './departments.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

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
        if (!CreateDepartmentDto.company_id || CreateDepartmentDto.company_id !== user.company_id) {
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
      return this.departmentsService.findDepartmentsByCompany(user.company_id);
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
      if (foundDepartment.company.id !== user.company_id) {
        throw new ForbiddenException('You can only view departments within your company.');
      }
    }

    return foundDepartment;
  }


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
      if (departmentToUpdate.company.id !== user.company_id) {
        throw new ForbiddenException('You can only update departments within your company.');
      }
    }

    await this.departmentsService.update(id, updateDepartmentDto);
    return this.departmentsService.findOne(id);
  }

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
      if (departmentToDelete.company.id !== user.company_id) {
        throw new ForbiddenException('You can only delete departments within your company.');
      }
    }

    return this.departmentsService.remove(id);
  }
}


