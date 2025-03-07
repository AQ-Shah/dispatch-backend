import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispatch } from './dispatch.entity';

@Injectable()
export class DispatchService {
  constructor(
    @InjectRepository(Dispatch)
    private dispatchRepository: Repository<Dispatch>,
  ) {}

  findAll(): Promise<Dispatch[]> {
    return this.dispatchRepository.find();
  }

  async findOne(id: number): Promise<Dispatch> {
    const dispatch = await this.dispatchRepository.findOne({ where: { id } });
    if (!dispatch) {
      throw new NotFoundException(`Dispatch with ID ${id} not found`);
    }
    return dispatch;
  }

  create(dispatchData: Dispatch): Promise<Dispatch> {
    return this.dispatchRepository.save(dispatchData);
  }

  async remove(id: number): Promise<void> {
    const dispatch = await this.findOne(id);
    await this.dispatchRepository.remove(dispatch);
  }
}
