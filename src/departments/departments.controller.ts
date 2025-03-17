import { Controller, Get, Post, Delete, Body, Param,Request,UsePipes, ValidationPipe,  UseGuards, ForbiddenException} from '@nestjs/common';
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
      const isSuperAdmin = user.permissions.includes('manage_all_companies');
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
    const isSuperAdmin = user.permissions.includes('manage_all_companies');
    const hasCompanyPermission = user.permissions.includes('manage_company_departments');

    if (isSuperAdmin) {
      return this.departmentsService.findAll();
    } else if (hasCompanyPermission) {
      return this.departmentsService.findDepartmentsByCompany(user.company_id);
    } else {
      throw new ForbiddenException('You do not have permission to view departments.');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Department> {
    return this.departmentsService.findOne(id);
  }


 

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.departmentsService.remove(id);
  }
}


