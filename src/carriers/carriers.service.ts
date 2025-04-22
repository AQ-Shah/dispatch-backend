import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrier } from './carriers.entity';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { User } from '../users/users.entity';

@Injectable()
export class CarriersService {
  constructor(
    @InjectRepository(Carrier)
    private carriersRepository: Repository<Carrier>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<Carrier> {
    const carrier = await this.carriersRepository.findOne({
      where: { id },
      relations: ['owner', 'trucks', 'dispatch_links'],
    });

    if (!carrier) throw new NotFoundException(`Carrier with ID ${id} not found`);
    return carrier;
  }

  async findAll(): Promise<Carrier[]> {
    return this.carriersRepository.find({
      relations: ['owner', 'trucks', 'dispatch_links'],
    });
  }

  async create(dto: CreateCarrierDto, ownerId: number): Promise<Carrier> {
    const owner = await this.usersRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new BadRequestException('Invalid owner ID');
    }

    const existing = await this.carriersRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('A carrier with this email already exists');
    }

    const newCarrier = this.carriersRepository.create({
      ...dto,
      owner,
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
    await this.carriersRepository.remove(carrier);
  }
}
