import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from './teams.entity';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Post()
  create(@Body() teamData: Team): Promise<Team> {
    return this.teamsService.create(teamData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.teamsService.remove(id);
  }
}
