import { Controller, Get, Post, Delete, Body, Param, Request,ForbiddenException, BadRequestException,  UseGuards, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from './teams.entity';
import { DepartmentsService } from '../departments/departments.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService, private readonly departmentService: DepartmentsService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Request() req, @Body() createTeamDto: CreateTeamDto) {
    const { user } = req;
  
    const isSuperAdmin = user.roles.includes('Super Admin');
    const canManageTeams = user.permissions.includes('manage_company_teams');
  
    if (!isSuperAdmin && !canManageTeams) {
      throw new ForbiddenException('You do not have permission to create teams.');
    }
  
    if (!isSuperAdmin) {
      const department = await this.departmentService.findOne(createTeamDto.department_id);
  
      if (!department) {
        throw new BadRequestException('Invalid department_id: Department does not exist.');
      }
  
      if (department.company.id !== user.company.id) {
        throw new ForbiddenException('You can only create teams within your company.');
      }
    }
      return this.teamsService.create(createTeamDto);
  }
  
  
  @Get()
  findAll(@Request() req): Promise<Team[]> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const hasTeamPermission = user.permissions.includes('manage_company_teams');

    if (!isSuperAdmin && !hasTeamPermission) {
      throw new ForbiddenException('You do not have permission to view teams.');
    }

    if (!isSuperAdmin) {
      return this.teamsService.findTeamsByDepartment(user.department_id);
    } 
    return this.teamsService.findAll();
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Team> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const hasTeamPermission = user.permissions.includes('manage_company_teams');

    const foundTeam = await this.teamsService.findOne(id);

    if (!isSuperAdmin && !hasTeamPermission) {
      throw new ForbiddenException('You do not have permission to view teams.');
    }

    if (!isSuperAdmin) {
      if (foundTeam.department.id !== user.department_id) {
        throw new ForbiddenException('You can only view teams within your department.');
      }
    }
    return foundTeam;
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Request() req, @Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto): Promise<Team> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const hasTeamPermission = user.permissions.includes('manage_company_teams');

    if (!isSuperAdmin && !hasTeamPermission) {
      throw new ForbiddenException('You do not have permission to update teams.');
    }

    const team = await this.teamsService.findOne(id);
    
    if (!isSuperAdmin) {
      if (team.department.company.id !== user.dispatch_c_id) {
        throw new ForbiddenException('You can only update teams within your company.');
      }
    }

    await this.teamsService.update(id, updateTeamDto);
    return this.teamsService.findOne(id);

  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number): Promise<void> {
    const { user } = req;
    const isSuperAdmin = user.roles.includes('Super Admin');
    const hasTeamPermission = user.permissions.includes('manage_company_teams');


    if (!isSuperAdmin && !hasTeamPermission) {
      throw new ForbiddenException('You do not have permission to delete teams.');
    }

    const teamToDelete = await this.teamsService.findOne(id);

    if (!isSuperAdmin) {
      if (teamToDelete.department.company.id !== user.dispatch_c_id) {
        throw new ForbiddenException('You can only delete teams within your company.');
      }
    }
    return this.teamsService.remove(id);
  }
}
