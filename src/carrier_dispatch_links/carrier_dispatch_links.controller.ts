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
import { CarrierDispatchLink } from './carrier_dispatch_links.entity';
import { CarrierDispatchLinksService } from './carrier_dispatch_links.service';
import { TeamsService } from 'src/teams/teams.service';
import { UsersService } from 'src/users/users.service';
import { Throttle } from '@nestjs/throttler';
import { CreateCarrierDispatchLinkDto } from './dto/create-carrier-link.dto';
import { EditCarrierDispatchLinkDto } from './dto/edit-carrier-link.dto'; 
import { UpdateCarrierDispatchLinkDto } from './dto/update-carrier-link.dto'; 

@Controller('carrier-dispatch-links')
@UseGuards(JwtAuthGuard)
export class CarrierDispatchLinksController {
  constructor(
    private readonly carrierLinksService: CarrierDispatchLinksService,
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Request() req, @Body() dto: CreateCarrierDispatchLinkDto): Promise<CarrierDispatchLink> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    if (isSuperAdmin) {
      return this.carrierLinksService.create(dto, user.id);
    }

    if (dto.dispatch_c_id !== user.dispatch_c_id) {
      throw new ForbiddenException('You can only link carriers to your own dispatch company.');
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

    const canAssignAll = user.permissions.includes('create_carriers_for_all');
    const canAssignTeam = user.permissions.includes('create_carriers_for_team');
    const canAssignSelf = user.permissions.includes('create_carriers_for_self');

    if (!dto.creator_id) {
      throw new ForbiddenException('Creator ID is required');
    }
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
      return this.carrierLinksService.create(dto, user.id);
    }

    throw new ForbiddenException('You do not have permission to assign this creator.');
  }

  @Put(':id/edit')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async edit(@Request() req, @Param('id') id: number, @Body() dto: EditCarrierDispatchLinkDto): Promise<CarrierDispatchLink> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const link = await this.carrierLinksService.findOne(id);

    if (!link) throw new ForbiddenException('Carrier link not found.');

    const sameTeam = link.sales_team?.id === user.team_id || link.dispatch_team?.id === user.team_id;
    const isSelf = link.creator?.id === user.id;

    const canEditAll = user.permissions.includes('edit_all_carriers');
    const canEditTeam = user.permissions.includes('edit_team_carriers');
    const canEditSelf = user.permissions.includes('edit_self_carriers');

    if (
      isSuperAdmin ||
      (canEditAll && link.dispatchCompany.id === user.dispatch_c_id) ||
      (canEditTeam && sameTeam) ||
      (canEditSelf && isSelf)
    ) {
      return this.carrierLinksService.update(id, dto);
    }

    throw new ForbiddenException('You do not have permission to edit this link.');
  }

  @Put(':id/update')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Request() req, @Param('id') id: number, @Body() dto: UpdateCarrierDispatchLinkDto): Promise<CarrierDispatchLink> {
    return this.edit(req, id, dto);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async delete(@Request() req, @Param('id') id: number): Promise<void> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    const link = await this.carrierLinksService.findOne(id);
    if (!link) throw new ForbiddenException('Carrier link not found.');

    if (!isSuperAdmin) {
      throw new ForbiddenException('Only Super Admins can delete links.');
    }

    return this.carrierLinksService.remove(id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<CarrierDispatchLink> {
    const { user } = req;
    const link = await this.carrierLinksService.findOne(id);
    if (!link) throw new NotFoundException('Carrier link not found.');

    if (user.roles.includes('Super Admin')) return link;

    const canViewAll = user.permissions.includes('view_all_carriers');
    const canViewTeam = user.permissions.includes('view_only_team_carriers');
    const canViewSelf = user.permissions.includes('view_only_self_carriers');

    const sameTeam = link.sales_team?.id === user.team_id || link.dispatch_team?.id === user.team_id;
    const isSelf = link.creator?.id === user.id || link.owner?.id === user.id;

    if (
      (canViewAll && link.dispatchCompany.id === user.dispatch_c_id) ||
      (canViewTeam && sameTeam) ||
      (canViewSelf && isSelf)
    ) {
      return link;
    }

    throw new ForbiddenException('Access denied.');
  }

  @Get()
  async findAll(@Request() req): Promise<CarrierDispatchLink[]> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');

    if (isSuperAdmin) return this.carrierLinksService.findAll();

    const canViewAll = user.permissions.includes('view_all_carriers');
    const canViewTeam = user.permissions.includes('view_only_team_carriers');
    const canViewSelf = user.permissions.includes('view_only_self_carriers');

    if (canViewAll) return this.carrierLinksService.findByCompany(user.dispatch_c_id);
    if (canViewTeam) return this.carrierLinksService.findByTeam(user.dispatch_c_id, user.team_id);
    if (canViewSelf) return this.carrierLinksService.findBySelf(user.dispatch_c_id, user.id);

    throw new ForbiddenException('You do not have permission to view carrier links.');
  }
}
