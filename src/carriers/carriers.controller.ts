import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Carrier } from './carriers.entity';
import { CarriersService } from './carriers.service';
import { Throttle } from '@nestjs/throttler';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';

@Controller('carriers')
@UseGuards(JwtAuthGuard)
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Request() req, @Body() dto: CreateCarrierDto): Promise<Carrier> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    // Only Super Admin can directly create a carrier
    // Or allow open signup if you plan public registration
    if (!isSuperAdmin) {
      throw new ForbiddenException('Only Super Admins can create carrier profiles.');
    }

    return this.carriersService.create(dto, dto.owner_user_id ?? user.id);
  }

  @Put(':id')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() dto: UpdateCarrierDto,
  ): Promise<Carrier> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const carrier = await this.carriersService.findOne(id);

    if (!carrier) throw new NotFoundException('Carrier not found.');

    if (isSuperAdmin || carrier.owner.id === user.id) {
      return this.carriersService.update(id, dto);
    }

    throw new ForbiddenException('You do not have permission to update this carrier.');
  }

  @Delete(':id')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async delete(@Request() req, @Param('id') id: number): Promise<void> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const carrier = await this.carriersService.findOne(id);

    if (!carrier) throw new NotFoundException('Carrier not found.');

    if (!isSuperAdmin) {
      throw new ForbiddenException('Only Super Admins can delete carriers.');
    }

    return this.carriersService.remove(id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Carrier> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const carrier = await this.carriersService.findOne(id);

    if (!carrier) throw new NotFoundException('Carrier not found.');

    if (isSuperAdmin || carrier.owner.id === user.id) {
      return carrier;
    }

    throw new ForbiddenException('Access denied.');
  }

  @Get()
  async findAll(@Request() req): Promise<Carrier[]> {
    const { user } = req;

    if (!user.roles.includes('Super Admin')) {
      throw new ForbiddenException('Only Super Admins can view all carriers.');
    }

    return this.carriersService.findAll();
  }
}
