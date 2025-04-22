import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TruckDispatcher } from './truck_dispatchers.entity';
import { CreateTruckDispatcherDto } from './dto/create-truck-dispatcher.dto';
import { Truck } from '../trucks/trucks.entity';
import { User } from '../users/users.entity';

@Injectable()
export class TruckDispatchersService {
  constructor(
    @InjectRepository(TruckDispatcher)
    private dispatcherRepo: Repository<TruckDispatcher>,

    @InjectRepository(Truck)
    private truckRepo: Repository<Truck>,

    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async assignDispatcher(dto: CreateTruckDispatcherDto): Promise<TruckDispatcher> {
    const truck = await this.truckRepo.findOne({ where: { id: dto.truck_id } });
    const dispatcher = await this.userRepo.findOne({ where: { id: dto.dispatcher_user_id } });

    if (!truck || !dispatcher) throw new NotFoundException('Invalid truck or dispatcher ID');

    const assignment = this.dispatcherRepo.create({
      truck,
      dispatcher,
    });

    return this.dispatcherRepo.save(assignment);
  }

  async getDispatchersByTruck(truckId: number): Promise<TruckDispatcher[]> {
    return this.dispatcherRepo.find({
      where: { truck: { id: truckId }, active: true },
      relations: ['dispatcher'],
    });
  }

  async remove(id: number): Promise<void> {
    const record = await this.dispatcherRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Assignment not found');
    await this.dispatcherRepo.remove(record);
  }
}
