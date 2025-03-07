import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { Carrier } from './carriers.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 

@Controller('carriers')
@UseGuards(JwtAuthGuard) 
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Get()
  findAll(@Request() req): Promise<Carrier[]> {
    return this.carriersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() req): Promise<Carrier> {
    return this.carriersService.findOne(id, req.user);
  }

  @Post()
  create(@Body() carrierData: Carrier, @Request() req): Promise<Carrier> {
    return this.carriersService.create(carrierData, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Request() req): Promise<void> {
    return this.carriersService.remove(id, req.user);
  }
}
