import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
    ForbiddenException,
    NotFoundException,
  } from '@nestjs/common';
  import { TruckDispatchersService } from './truck_dispatchers.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { CreateTruckDispatcherDto } from './dto/create-truck-dispatcher.dto';
  import { TruckDispatcher } from './truck_dispatchers.entity';
  
  @Controller('truck-dispatchers')
  @UseGuards(JwtAuthGuard)
  export class TruckDispatchersController {
    constructor(private readonly service: TruckDispatchersService) {}
  
    @Post()
    async assign(@Request() req, @Body() dto: CreateTruckDispatcherDto): Promise<TruckDispatcher> {
      const user = req.user;
  
      // Optionally add permission checks here
      return this.service.assignDispatcher(dto);
    }
  
    @Get(':truckId')
    async findDispatchers(@Param('truckId') truckId: number): Promise<TruckDispatcher[]> {
      return this.service.getDispatchersByTruck(truckId);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
      return this.service.remove(id);
    }
  }
  