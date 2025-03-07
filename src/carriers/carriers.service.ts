import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrier } from './carriers.entity';
import { User } from '../users/users.entity';

@Injectable()
export class CarriersService {
  constructor(
    @InjectRepository(Carrier)
    private carriersRepository: Repository<Carrier>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(user: User): Promise<Carrier[]> {
    const userPermissions = user.roles.flatMap(role => role.permissions.map(p => p.name));

    if (userPermissions.includes('view_all_carriers')) {
      return this.carriersRepository.find(); // Super Admin, Company Admin, Manager can see all carriers
    }

    if (userPermissions.includes('view_company_carriers')) {
      return this.carriersRepository.find({
        where: { company: { id: user.company.id } },
      });
    }

    if (userPermissions.includes('view_team_carriers')) {
      return this.carriersRepository
        .createQueryBuilder('carrier')
        .innerJoin('users', 'user', 'carrier.creator_id = user.id')
        .where('user.team_id = :teamId', { teamId: user.team.id })
        .getMany();
    }

    if (userPermissions.includes('view_assigned_carriers')) {
      return this.carriersRepository.find({
        where: { creator: { id: user.id } },
      });
    }

    throw new NotFoundException('Unauthorized access to carriers.');
  }

  async findOne(id: number, user: User): Promise<Carrier> {
    const userPermissions = user.roles.flatMap(role => role.permissions.map(p => p.name));

    const carrier = await this.carriersRepository.findOne({
      where: { id },
    });

    if (!carrier) {
      throw new NotFoundException(`Carrier with ID ${id} not found`);
    }

    if (userPermissions.includes('view_all_carriers') || 
        (userPermissions.includes('view_company_carriers') && carrier.company.id === user.company.id) ||
        (userPermissions.includes('view_team_carriers') && carrier.creator.team.id === user.team.id) ||
        (userPermissions.includes('view_assigned_carriers') && carrier.creator.id === user.id)) {
      return carrier;
    }

    throw new NotFoundException('Unauthorized access to carrier.');
  }

  async create(carrierData: Carrier, user: User): Promise<Carrier> {
    carrierData.creator = user;
    carrierData.company = user.company;
    return this.carriersRepository.save(carrierData);
  }

  async remove(id: number, user: User): Promise<void> {
    const carrier = await this.findOne(id, user);
    await this.carriersRepository.remove(carrier);
  }
}
