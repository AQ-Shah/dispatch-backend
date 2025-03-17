import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './departments.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
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
    const company = await this.companiesRepository.findOne({ where: { id: createDepartmentDto.company_id } });

    if (!company) {
      throw new BadRequestException('Invalid company_id: Company does not exist');
    }
    const newDepartment = this.departmentsRepository.create({
      name: createDepartmentDto.name, 
      company: company, 
    });

    return this.departmentsRepository.save(newDepartment);
  }


  async update (id:number, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    await this.departmentsRepository.update(id, updateDepartmentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentsRepository.remove(department);
  }
}
