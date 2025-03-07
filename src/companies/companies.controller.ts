import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './companies.entity';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Company> {
    return this.companiesService.findOne(id);
  }

  @Post()
  create(@Body() companyData: Company): Promise<Company> {
    return this.companiesService.create(companyData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.companiesService.remove(id);
  }
}
