import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './companies.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  findAll(): Promise<Company[]> {
    return this.companiesRepository.find();
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async findByUserCompany(companyId: number): Promise<Company[]> {
    return this.companiesRepository.find({ where: { id: companyId } });
  }
  

  create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companiesRepository.create(createCompanyDto);
    return this.companiesRepository.save(company);
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
  }
}
