import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './departments.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { Company } from '@app/companies/companies.entity';


@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(Company) 
    private companiesRepository: Repository<Company>,
  ) {}

  findAll(): Promise<Department[]> {
    return this.departmentsRepository.find();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentsRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async findDepartmentsByCompany(companyId: number): Promise<Department[]> {
        return this.departmentsRepository.find({ where: { id: companyId } });
      }
  
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {

  // Fetch the Company entity if `company_id` is provided
  let company: Company | null = null;
  if (createDepartmentDto.company_id) {
    company = await this.companiesRepository.findOne({ where: { id: createDepartmentDto.company_id } });
    if (!company) {
      throw new BadRequestException('Invalid company_id: Company does not exist');
    }
  }
    return this.departmentsRepository.save(createDepartmentDto);
  }

  async remove(id: number): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentsRepository.remove(department);
  }
}
