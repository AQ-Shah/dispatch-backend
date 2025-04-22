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
  NotFoundException
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Carrier } from './carriers.entity';
import { CarriersService } from './carriers.service';
import { TeamsService } from 'src/teams/teams.service';
import { UsersService } from 'src/users/users.service';
import { Throttle } from '@nestjs/throttler';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { EditCarrierDto } from './dto/edit-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';


@Controller('carriers')
@UseGuards(JwtAuthGuard)
export class CarriersController {
  constructor(
    private readonly carriersService: CarriersService,
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Request() req, @Body() dto: CreateCarrierDto): Promise<Carrier> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
  
    if (isSuperAdmin) {
      return this.carriersService.create(dto, user.id);
    }
  
    if (dto.dispatch_c_id !== user.dispatch_c_id) {
      throw new ForbiddenException('You can only create carriers for your own company.');
    }
  
    if (dto.dispatch_team_id) {
      if (!user.permissions.includes('assign_dispatch_team')) {
        throw new ForbiddenException('You do not have permission to assign a dispatch team.');
      }
  
      const dispatchTeam = await this.teamsService.findOne(dto.dispatch_team_id);
      if (!dispatchTeam || dispatchTeam.department.company.id !== user.dispatch_c_id) {
        throw new ForbiddenException('Dispatch team must belong to your company.');
      }
    }
  
    // ✅ Permission checks for creator assignment
    const canAssignAll = user.permissions.includes('create_carriers_for_all');
    const canAssignTeam = user.permissions.includes('create_carriers_for_team');
    const canAssignSelf = user.permissions.includes('create_carriers_for_self');
  
    const creator = await this.usersService.findOne(dto.creator_id);
    if (!creator || creator.company?.id !== user.dispatch_c_id) {
      throw new ForbiddenException('Creator must be in the same company.');
    }
  
    const sameTeam = creator.team?.id === user.team_id;
  
    if (
      (canAssignAll) ||
      (canAssignTeam && sameTeam) ||
      (canAssignSelf && creator.id === user.id)
    ) {
      return this.carriersService.create(dto, user.id);
    }
  
    throw new ForbiddenException('You do not have permission to assign this creator.');
  }
  

  @Put(':id/edit')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async edit(@Request() req, @Param('id') id: number, @Body() dto: EditCarrierDto): Promise<Carrier> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const carrier = await this.carriersService.findOne(id);
  
    if (!carrier) throw new ForbiddenException('Carrier not found.');
  
    if (isSuperAdmin) return this.carriersService.update(id, dto);
  
    const canEditAll = user.permissions.includes('edit_all_carriers');
    const canEditTeam = user.permissions.includes('edit_team_carriers');
    const canEditSelf = user.permissions.includes('edit_self_carriers');
  
    const sameTeam = carrier.sales_team?.id === user.team_id || carrier.dispatch_team?.id === user.team_id;
    const isSelf = carrier.creator?.id === user.id;
  
    if (
      (canEditAll && carrier.company.id === user.dispatch_c_id) ||
      (canEditTeam && sameTeam) ||
      (canEditSelf && isSelf)
    ) {
      return this.carriersService.update(id, dto);
    }
  
    throw new ForbiddenException('You do not have permission to edit this carrier.');
  }

  @Put(':id/update')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Request() req, @Param('id') id: number, @Body() dto: UpdateCarrierDto): Promise<Carrier> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const carrier = await this.carriersService.findOne(id);
  
    if (!carrier) throw new ForbiddenException('Carrier not found.');
  
    if (isSuperAdmin) return this.carriersService.update(id, dto);
  
    const canEditAll = user.permissions.includes('edit_all_carriers');
    const canEditTeam = user.permissions.includes('edit_team_carriers');
    const canEditSelf = user.permissions.includes('edit_self_carriers');
  
    const sameTeam = carrier.sales_team?.id === user.team_id || carrier.dispatch_team?.id === user.team_id;
    const isSelf = carrier.creator?.id === user.id;
  
    if (
      (canEditAll && carrier.company.id === user.dispatch_c_id) ||
      (canEditTeam && sameTeam) ||
      (canEditSelf && isSelf)
    ) {
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

    if (!carrier) {
      throw new ForbiddenException('Carrier not found.');
    }

    if (!isSuperAdmin) {
      throw new ForbiddenException('Only Super Admins or Dispatchers can delete carriers.');
    }

    return this.carriersService.remove(id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Carrier> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
  
    const carrier = await this.carriersService.findOne(id);
  
    if (!carrier) {
      throw new NotFoundException('Carrier not found.');
    }
  
    if (isSuperAdmin) {
      return carrier;
    }
  
    const hasViewAll = user.permissions.includes('view_all_carriers');
    const hasViewTeam = user.permissions.includes('view_only_team_carriers');
    const hasViewSelf = user.permissions.includes('view_only_self_carriers');
  
    if (hasViewAll && carrier.company.id === user.dispatch_c_id) {
      return carrier;
    }
  
    if (
      hasViewTeam &&
      carrier.company.id === user.dispatch_c_id &&
      (
        carrier.sales_team?.id === user.team_id ||
        carrier.dispatch_team?.id === user.team_id
      )
    ) {
      return carrier;
    }
  
    if (
      hasViewSelf &&
      carrier.company.id === user.dispatch_c_id &&
      (
        carrier.creator?.id === user.id ||
        carrier.owner?.id === user.id
      )
    ) {
      return carrier;
    }
  
    throw new ForbiddenException('Access denied.');
  }
  

  @Get()
  async findAll(@Request() req): Promise<Carrier[]> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
  
    if (isSuperAdmin) {
      return this.carriersService.findAll();
    }
  
    const hasViewAll = user.permissions.includes('view_all_carriers');
    const hasViewTeam = user.permissions.includes('view_only_team_carriers');
    const hasViewSelf = user.permissions.includes('view_only_self_carriers');
  
    if (hasViewAll) {
      return this.carriersService.findByCompany(user.dispatch_c_id);
    }
  
    if (hasViewTeam) {
      return this.carriersService.findByTeam(user.dispatch_c_id, user.team_id);
    }
  
    if (hasViewSelf) {
      return this.carriersService.findBySelf(user.dispatch_c_id, user.id);
    }
  
    throw new ForbiddenException('You do not have permission to view carriers.');
  }
  
  
}
