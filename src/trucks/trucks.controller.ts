import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { Truck } from './trucks.entity';

@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Get()
  findAll(): Promise<Truck[]> {
    return this.trucksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Truck> {
    return this.trucksService.findOne(id);
  }

  @Post()
  create(@Body() truckData: Truck): Promise<Truck> {
    return this.trucksService.create(truckData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.trucksService.remove(id);
  }
}
