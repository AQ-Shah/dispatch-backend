import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from './trucks.entity';
import { CreateTruckDto } from './dto/create-truck.dto';
import { Carrier } from '../carriers/carriers.entity';
import { User } from '../users/users.entity';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck)
    private trucksRepository: Repository<Truck>,

    @InjectRepository(Carrier)
    private carriersRepository: Repository<Carrier>,

    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findAll(): Promise<Truck[]> {
    return this.trucksRepository.find({
      relations: ['carrier', 'driver', 'dispatcher_assignments'],
    });
  }

  async findOne(id: number): Promise<Truck> {
    const truck = await this.trucksRepository.findOne({
      where: { id },
      relations: ['carrier', 'driver', 'dispatcher_assignments'],
    });

    if (!truck) {
      throw new NotFoundException(`Truck with ID ${id} not found`);
    }

    return truck;
  }

  async create(dto: CreateTruckDto): Promise<Truck> {
    const carrier = await this.carriersRepository.findOne({ where: { id: dto.carrier_id } });
    if (!carrier) throw new NotFoundException('Carrier not found');
  
    let driver: User | null = null;
    if (dto.driver_user_id) {
      driver = await this.usersRepository.findOne({ where: { id: dto.driver_user_id } });
      if (!driver) throw new NotFoundException('Driver user not found');
    }
  
    const truck = this.trucksRepository.create({
      ...dto,
      carrier,
      ...(driver && { driver }), 
    });
  
    return this.trucksRepository.save(truck);
  }
  

  async remove(id: number): Promise<void> {
    const truck = await this.findOne(id);
    await this.trucksRepository.remove(truck);
  }
}
