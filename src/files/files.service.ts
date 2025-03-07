import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  findAll(): Promise<File[]> {
    return this.filesRepository.find();
  }

  async findOne(id: number): Promise<File> {
    const file = await this.filesRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return file;
  }

  create(fileData: File): Promise<File> {
    return this.filesRepository.save(fileData);
  }

  async remove(id: number): Promise<void> {
    const file = await this.findOne(id);
    await this.filesRepository.remove(file);
  }
}
