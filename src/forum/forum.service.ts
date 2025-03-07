import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Forum } from './forum.entity';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(Forum)
    private forumRepository: Repository<Forum>,
  ) {}

  findAll(): Promise<Forum[]> {
    return this.forumRepository.find();
  }

  async findOne(id: number): Promise<Forum> {
    const forum = await this.forumRepository.findOne({ where: { id } });
    if (!forum) {
      throw new NotFoundException(`Forum topic with ID ${id} not found`);
    }
    return forum;
  }

  create(forumData: Forum): Promise<Forum> {
    return this.forumRepository.save(forumData);
  }

  async remove(id: number): Promise<void> {
    const forum = await this.findOne(id);
    await this.forumRepository.remove(forum);
  }
}
