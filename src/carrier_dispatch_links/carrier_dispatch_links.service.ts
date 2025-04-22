import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarrierDispatchLink } from './carrier_dispatch_links.entity';
import { Company } from '../companies/companies.entity';
import { User } from '../users/users.entity';
import { CreateCarrierDispatchLinkDto } from './dto/create-carrier-link.dto';
import { UpdateCarrierDispatchLinkDto } from './dto/update-carrier-link.dto';

@Injectable()
export class CarrierDispatchLinksService {
  constructor(
    @InjectRepository(CarrierDispatchLink)
    private carrierLinksRepository: Repository<CarrierDispatchLink>,

    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<CarrierDispatchLink> {
    const link = await this.carrierLinksRepository.findOne({
      where: { id },
      relations: ['dispatchCompany', 'creator', 'owner', 'sales_team', 'dispatch_team', 'sale_matured_dispatch'],
    });

    if (!link) throw new NotFoundException(`Carrier link with ID ${id} not found`);

    return link;
  }

  async findAll(): Promise<CarrierDispatchLink[]> {
    return this.carrierLinksRepository.find({
      relations: ['dispatchCompany', 'creator', 'owner', 'sales_team', 'dispatch_team', 'sale_matured_dispatch'],
    });
  }

  async findByCompany(dispatchCompanyId: number): Promise<CarrierDispatchLink[]> {
    return this.carrierLinksRepository.find({
      where: { dispatchCompany: { id: dispatchCompanyId } },
      relations: ['dispatchCompany', 'creator', 'owner', 'sales_team', 'dispatch_team'],
    });
  }

  async findByTeam(dispatchCompanyId: number, teamId: number): Promise<CarrierDispatchLink[]> {
    return this.carrierLinksRepository.find({
      where: [
        { dispatchCompany: { id: dispatchCompanyId }, sales_team: { id: teamId } },
        { dispatchCompany: { id: dispatchCompanyId }, dispatch_team: { id: teamId } },
      ],
      relations: ['dispatchCompany', 'sales_team', 'dispatch_team'],
    });
  }

  async findBySelf(dispatchCompanyId: number, userId: number): Promise<CarrierDispatchLink[]> {
    return this.carrierLinksRepository.find({
      where: [
        { dispatchCompany: { id: dispatchCompanyId }, creator: { id: userId } },
        { dispatchCompany: { id: dispatchCompanyId }, owner: { id: userId } },
      ],
      relations: ['dispatchCompany', 'creator', 'owner'],
    });
  }

  async create(dto: CreateCarrierDispatchLinkDto, creatorId: number): Promise<CarrierDispatchLink> {
    const company = await this.companiesRepository.findOne({ where: { id: dto.dispatch_c_id } });
    if (!company) {
      throw new BadRequestException('Invalid dispatch_c_id: Company not found');
    }

    const creator = await this.usersRepository.findOne({ where: { id: creatorId } });
    if (!creator) {
      throw new BadRequestException('Invalid creator ID');
    }

    const newLink = this.carrierLinksRepository.create({
      ...dto,
      dispatchCompany: company,
      creator,
    });

    return this.carrierLinksRepository.save(newLink);
  }

  async update(id: number, dto: UpdateCarrierDispatchLinkDto): Promise<CarrierDispatchLink> {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException(`Carrier link with ID ${id} not found`);

    await this.carrierLinksRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const link = await this.findOne(id);
    await this.carrierLinksRepository.remove(link);
  }
}
