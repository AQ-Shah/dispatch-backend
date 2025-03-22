import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrier } from './carriers.entity';
import { Company } from '../companies/companies.entity';
import { User } from '../users/users.entity';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';

@Injectable()
export class CarriersService {
  constructor(
    @InjectRepository(Carrier)
    private carriersRepository: Repository<Carrier>,

    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,

    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findOne(id: number): Promise<Carrier> {
    const carrier = await this.carriersRepository.findOne({
      where: { id },
      relations: ['company', 'creator', 'owner', 'sales_team', 'dispatch_team', 'sale_matured_dispatch']
    });

    if (!carrier) {
      throw new NotFoundException(`Carrier with ID ${id} not found`);
    }

    return carrier;
  }

  async findAll(): Promise<Carrier[]> {
    return this.carriersRepository.find({
      relations: ['company', 'creator', 'owner', 'sales_team', 'dispatch_team', 'sale_matured_dispatch']
    });
  }

  async findByCompany(companyId: number): Promise<Carrier[]> {
    return this.carriersRepository.find({
      where: { company: { id: companyId } },
      relations: ['company', 'creator', 'owner', 'sales_team', 'dispatch_team', 'sale_matured_dispatch']
    });
  }

  async findByTeam(companyId: number, teamId: number): Promise<Carrier[]> {
    return this.carriersRepository.find({
      where: [
        { company: { id: companyId }, sales_team: { id: teamId } },
        { company: { id: companyId }, dispatch_team: { id: teamId } },
      ],
      relations: ['company', 'sales_team', 'dispatch_team'],
    });
  }

  async findBySelf(companyId: number, userId: number): Promise<Carrier[]> {
    return this.carriersRepository.find({
      where: [
        { company: { id: companyId }, creator: { id: userId } },
        { company: { id: companyId }, owner: { id: userId } },
      ],
      relations: ['company', 'creator', 'owner'],
    });
  }
  

  async create(dto: CreateCarrierDto, creatorId: number): Promise<Carrier> {
    const company = await this.companiesRepository.findOne({ where: { id: dto.company_id } });
    if (!company) {
      throw new BadRequestException('Invalid company_id');
    }

    const creator = await this.usersRepository.findOne({ where: { id: creatorId } });
    if (!creator) {
      throw new BadRequestException('Invalid creator ID');
    }

    const newCarrier = this.carriersRepository.create({
      ...dto,
      company,
      creator,
    });

    return this.carriersRepository.save(newCarrier);
  }

  async update(id: number, dto: UpdateCarrierDto): Promise<Carrier> {
    const existingCarrier = await this.findOne(id);

    if (!existingCarrier) {
      throw new NotFoundException(`Carrier with ID ${id} not found`);
    }

    await this.carriersRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const carrier = await this.findOne(id);
    if (!carrier) {
      throw new NotFoundException(`Carrier with ID ${id} not found`);
    }
    await this.carriersRepository.remove(carrier);
  }
}
