import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { DispatchService } from './dispatches.service';
import { Dispatch } from './dispatches.entity';

@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get()
  findAll(): Promise<Dispatch[]> {
    return this.dispatchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Dispatch> {
    return this.dispatchService.findOne(id);
  }

  @Post()
  create(@Body() dispatchData: Dispatch): Promise<Dispatch> {
    return this.dispatchService.create(dispatchData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.dispatchService.remove(id);
  }
}
