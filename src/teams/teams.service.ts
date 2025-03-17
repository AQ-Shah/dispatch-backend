import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/users/users.entity';
import { Team } from './teams.entity';
import { Department } from '@app/departments/departments.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  findAll(): Promise<Team[]> {
    return this.teamsRepository.find({
      relations: { department: true },
    });
  
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: { department: true }, 
    });
    
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async findTeamsByDepartment(departmentId: number): Promise<Team[]> {
    return this.teamsRepository.find({
      where: { department: { id: departmentId } },
      relations: { department: true },
    });
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const department = await this.departmentsRepository.findOne({
      where: { id: createTeamDto.department_id },
      relations: { company: true }, 
    });
  
    if (!department) {
      throw new BadRequestException('Invalid department_id: Department does not exist.');
    }
  
    const newTeam = this.teamsRepository.create({
      name: createTeamDto.name,
      department: department,
    });
  
    return this.teamsRepository.save(newTeam);
  }
  
  

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    await this.teamsRepository.update(id, updateTeamDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const team = await this.findOne(id);
    await this.teamsRepository.remove(team);
  }
}
