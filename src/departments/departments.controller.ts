import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './departments.entity';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Post()
  create(@Body() departmentData: Department): Promise<Department> {
    return this.departmentsService.create(departmentData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.departmentsService.remove(id);
  }
}
