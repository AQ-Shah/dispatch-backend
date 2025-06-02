import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './departments.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Company } from '@app/companies/companies.entity';
import { Carrier } from '@app/carriers/carriers.entity';
import { User } from '@app/users/users.entity';

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
    return this.departmentsRepository.find({
      where: { company: { id: companyId } },
      relations: { company: true }, 
    });
  }
  
    
async create(dto: CreateDepartmentDto, user: User): Promise<Department> {
  const department = new Department();
  department.name = dto.name;

  if (dto.dispatch_c_id) {
    department.company = { id: dto.dispatch_c_id } as Company;
  } else if (dto.carrier_id) {
    department.carrier = { id: dto.carrier_id } as Carrier;
  } else if (user.company?.id) {
    department.company = { id: user.company.id } as Company;
  } else if (user.carrier?.id) {
    department.carrier = { id: user.carrier.id } as Carrier;
  } else {
    throw new BadRequestException('No valid dispatch or carrier ID found to associate.');
  }

  return this.departmentsRepository.save(department);
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
