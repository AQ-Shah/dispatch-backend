import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from './trucks.entity';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck)
    private trucksRepository: Repository<Truck>,
  ) {}

  findAll(): Promise<Truck[]> {
    return this.trucksRepository.find();
  }

  async findOne(id: number): Promise<Truck> {
    const truck = await this.trucksRepository.findOne({ where: { id } });
    if (!truck) {
      throw new NotFoundException(`Truck with ID ${id} not found`);
    }
    return truck;
  }

  create(truckData: Truck): Promise<Truck> {
    return this.trucksRepository.save(truckData);
  }

  async remove(id: number): Promise<void> {
    const truck = await this.findOne(id);
    await this.trucksRepository.remove(truck);
  }
}
