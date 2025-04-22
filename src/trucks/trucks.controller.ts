import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { Truck } from './trucks.entity';
import { CreateTruckDto } from './dto/create-truck.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('trucks')
@UseGuards(JwtAuthGuard)
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async findAll(@Request() req): Promise<Truck[]> {
    const { user } = req;

    const isSuperAdmin = user.roles.includes('Super Admin');
    const isCarrier = !!user.carrier;

    if (isSuperAdmin || isCarrier) {
      return this.trucksService.findAll(); // 🔒 Filter by carrier if needed
    }

    throw new ForbiddenException('You are not authorized to view trucks');
  }

  @Get(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async findOne(@Request() req, @Param('id') id: number): Promise<Truck> {
    const { user } = req;
    const truck = await this.trucksService.findOne(id);

    const isSuperAdmin = user.roles.includes('Super Admin');
    const isCarrierOwner = truck.carrier?.owner?.id === user.id;

    if (isSuperAdmin || isCarrierOwner) {
      return truck;
    }

    throw new ForbiddenException('You are not authorized to view this truck');
  }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Request() req, @Body() dto: CreateTruckDto): Promise<Truck> {
    const { user } = req;

    const isSuperAdmin = user.roles.includes('Super Admin');
    const isCarrier = !!user.carrier_id;

    if (isSuperAdmin || isCarrier) {
      // Optional: auto-inject carrier_id from logged in carrier
      if (!isSuperAdmin) dto.carrier_id = user.carrier_id;

      return this.trucksService.create(dto);
    }

    throw new ForbiddenException('You are not authorized to create trucks');
  }

  @Delete(':id')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async remove(@Request() req, @Param('id') id: number): Promise<void> {
    const { user } = req;
    const truck = await this.trucksService.findOne(id);

    const isSuperAdmin = user.roles.includes('Super Admin');
    const isCarrierOwner = truck.carrier?.owner?.id === user.id;

    if (isSuperAdmin || isCarrierOwner) {
      return this.trucksService.remove(id);
    }

    throw new ForbiddenException('You are not authorized to delete this truck');
  }
}
