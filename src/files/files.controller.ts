import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { FilesService } from './files.service';
import { File } from './files.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(): Promise<File[]> {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<File> {
    return this.filesService.findOne(id);
  }

  @Post()
  create(@Body() fileData: File): Promise<File> {
    return this.filesService.create(fileData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.filesService.remove(id);
  }
}
