import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispatch } from './dispatches.entity';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { Carrier } from '../carriers/carriers.entity';
import { Company } from '../companies/companies.entity';
import { Truck } from '../trucks/trucks.entity';
import { User } from '../users/users.entity';

@Injectable()
export class DispatchService {
  constructor(
    @InjectRepository(Dispatch)
    private dispatchRepo: Repository<Dispatch>,

    @InjectRepository(Carrier)
    private carrierRepo: Repository<Carrier>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    @InjectRepository(Truck)
    private truckRepo: Repository<Truck>,

    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async findOne(id: number): Promise<Dispatch> {
    const dispatch = await this.dispatchRepo.findOne({
      where: { id },
      relations: ['carrier', 'company', 'truck', 'dispatcher'],
    });

    if (!dispatch) throw new NotFoundException(`Dispatch with ID ${id} not found`);
    return dispatch;
  }

  async findAll(): Promise<Dispatch[]> {
    return this.dispatchRepo.find({
      relations: ['carrier', 'company', 'truck', 'dispatcher'],
    });
  }

  async findByUserContext(user: any): Promise<Dispatch[]> {
    const filters: any = {};
    if (user.carrier_id) {
      filters.carrier = { id: user.carrier_id };
    } else if (user.dispatch_c_id) {
      filters.company = { id: user.dispatch_c_id };
    } else {
      return [];
    }

    return this.dispatchRepo.find({
      where: filters,
      relations: ['carrier', 'company', 'truck', 'dispatcher'],
    });
  }

  async create(dto: CreateDispatchDto): Promise<Dispatch> {
    const carrier = await this.carrierRepo.findOne({ where: { id: dto.carrier_id } });
    const company = await this.companyRepo.findOne({ where: { id: dto.company_id } });
    const truck = await this.truckRepo.findOne({ where: { id: dto.truck_id } });
    const dispatcher = await this.userRepo.findOne({ where: { id: dto.dispatcher_id } });

    if (!carrier || !company || !truck || !dispatcher) {
      throw new BadRequestException('Invalid carrier, company, truck, or dispatcher ID');
    }

    const dispatch = this.dispatchRepo.create({
      ...dto,
      carrier,
      company,
      truck,
      dispatcher,
    });

    return this.dispatchRepo.save(dispatch);
  }

  async remove(id: number): Promise<void> {
    const dispatch = await this.findOne(id);
    await this.dispatchRepo.remove(dispatch);
  }
}
