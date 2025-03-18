import {
  Controller, Get, Post, Body, Param, Delete, UseGuards,Request,ForbiddenException,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 
import { Throttle } from '@nestjs/throttler';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  async create(@Request() req, @Body() createCompanyDto: CreateCompanyDto) {
    const { user } = req;

    const isSuperAdmin = user.roles.includes('Super Admin');

    if (!isSuperAdmin) {
      throw new ForbiddenException('Only Super Admin can create companies.');
    }

    return this.companyService.create(createCompanyDto);
  }

  
  @Get()
  async findAll(@Request() req) {
    const { user } = req;

    const isSuperAdmin = user.roles.includes('Super Admin');

    if (isSuperAdmin) {
      return this.companyService.findAll();
    } else {
      return this.companyService.findByUserCompany(user.company_id);
    }
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number) {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    if (isSuperAdmin) {
      return this.companyService.findOne(id);
    } else {
      const company = await this.companyService.findOne(id);
      if (company.id !== user.company_id) {
        throw new ForbiddenException('You can only view your own company.');
      }
      return company;
    }
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    if (!isSuperAdmin) {
      throw new ForbiddenException('Only Super Admin can delete companies.');
    }

    return this.companyService.remove(id);
  }
}
