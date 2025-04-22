import {
  Controller,
  Get,
  Post,
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
import { DispatchService } from './dispatches.service';
import { Dispatch } from './dispatches.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';

@Controller('dispatches')
@UseGuards(JwtAuthGuard)
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async findAll(@Request() req): Promise<Dispatch[]> {
    const user = req.user;

    if (user.roles.includes('Super Admin')) {
      return this.dispatchService.findAll();
    }

    // Carrier owners or dispatchers viewing their own company/cargo
    if (user.carrier_id || user.dispatch_c_id) {
      return this.dispatchService.findByUserContext(user);
    }

    throw new ForbiddenException('You do not have permission to view dispatches.');
  }

  @Get(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async findOne(@Request() req, @Param('id') id: number): Promise<Dispatch> {
    const user = req.user;
    const dispatch = await this.dispatchService.findOne(id);

    if (!dispatch) throw new NotFoundException('Dispatch not found.');

    const isSuperAdmin = user.roles.includes('Super Admin');
    const isOwner = dispatch.dispatcher?.id === user.id || dispatch.carrier?.owner?.id === user.id;

    if (isSuperAdmin || isOwner) return dispatch;

    throw new ForbiddenException('Access denied.');
  }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Request() req, @Body() dto: CreateDispatchDto): Promise<Dispatch> {
    const user = req.user;

    const isSuperAdmin = user.roles.includes('Super Admin');
    const isDispatcher = !!user.dispatch_c_id;

    if (!isSuperAdmin && !isDispatcher) {
      throw new ForbiddenException('You are not authorized to create dispatches.');
    }

    // Optional: auto-fill dispatch company if coming from dispatcher
    if (!isSuperAdmin) {
      dto.company_id = user.dispatch_c_id;
      dto.dispatcher_id = user.id;
    }

    return this.dispatchService.create(dto);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async remove(@Request() req, @Param('id') id: number): Promise<void> {
    const user = req.user;
    const dispatch = await this.dispatchService.findOne(id);

    if (!dispatch) throw new NotFoundException('Dispatch not found.');

    const isSuperAdmin = user.roles.includes('Super Admin');
    const isOwner = dispatch.dispatcher?.id === user.id || dispatch.carrier?.owner?.id === user.id;

    if (isSuperAdmin || isOwner) {
      return this.dispatchService.remove(id);
    }

    throw new ForbiddenException('Access denied.');
  }
}
