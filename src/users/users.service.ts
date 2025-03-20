import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { Company } from '@app/companies/companies.entity';
import { Department } from '@app/departments/departments.entity';
import { Team } from '@app/teams/teams.entity';
import { UserPermissionsService } from '../user_permissions/user_permissions.service';
import { UserRolesService } from '../user_roles/user_roles.service'; 
import { UserRole } from '@app/user_roles/user_roles.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company) 
    private companiesRepository: Repository<Company>,
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    private userPermissionsService: UserPermissionsService,
    private userRolesService: UserRolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if the email already exists
    const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
  
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
  
    // Fetch the Company entity if `company_id` is provided
    let company: Company | null = null;
    if (createUserDto.company_id) {
      company = await this.companiesRepository.findOne({ where: { id: createUserDto.company_id } });
      if (!company) {
        throw new BadRequestException('Invalid company_id: Company does not exist');
      }
    }
  
    // Fetch the Department entity if `department_id` is provided
    let department: Department | null = null;
    if (createUserDto.department_id) {
      department = await this.departmentsRepository.findOne({
        where: { id: createUserDto.department_id },
        relations: { company: true },
      });
  
      if (!department) {
        throw new BadRequestException('Invalid department_id: Department does not exist.');
      }
  
      if (department.company.id !== createUserDto.company_id) {
        throw new BadRequestException('Invalid department_id: Department does not belong to the provided company.');
      }
    }
  
    // Fetch the Team entity if `team_id` is provided
    let team: Team | null = null;
    if (createUserDto.team_id) {
      if (!createUserDto.department_id) {
        throw new BadRequestException('team_id cannot be provided without a valid department_id.');
      }
  
      team = await this.teamsRepository.findOne({
        where: { id: createUserDto.team_id },
        relations: { department: true }, 
      });
  
      if (!team) {
        throw new BadRequestException('Invalid team_id: Team does not exist.');
      }
  
      if (team.department.id !== createUserDto.department_id) {
        throw new BadRequestException('Invalid team_id: Team does not belong to the provided department.');
      }
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create the user instance
    const newUser = this.usersRepository.create({
      ...createUserDto,
      hashed_password: hashedPassword,
      ...(company && { company }),
      ...(department && { department }),
      ...(team && { team }),
    });
  
    const savedUser = await this.usersRepository.save(newUser);

    if (createUserDto.role_id) {
      const user = await this.usersRepository.findOne({ where: { id: savedUser.id } });
      const role = await this.userRolesService.getRoleById(createUserDto.role_id);
    
      if (!user || !role) {
        throw new BadRequestException('Invalid user or role.');
      }
    
      const userRole = new UserRole();
      userRole.user_id = user.id;
      userRole.role_id = role.id;
    
      await this.userRolesService.assignRole(userRole); 
      await this.userPermissionsService.assignDefaultPermissions(savedUser.id, createUserDto.role_id);
    }
    
    return savedUser;

  }
  
  async getUserPermissions(userId: number) {
    return this.userPermissionsService.getUserPermissions(userId);
  }
  

  async validateDepartment(departmentId: number, companyId: number): Promise<boolean> {
    const department = await this.departmentsRepository.findOne({
      where: { id: departmentId },
      relations: { company: true }, 
    });
  
    if (!department) {
      throw new BadRequestException('Invalid department_id: Department does not exist.');
    }
  
    if (!department.company) {
      throw new BadRequestException('Department does not have an associated company.');
    }
  
    return department.company.id === companyId;
  }
  

  async validateTeam(teamId: number, departmentId: number, companyId: number): Promise<boolean> {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
      relations: { department: true }, 
    });
  
    if (!team) {
      throw new BadRequestException('Invalid team_id: Team does not exist.');
    }
  
    if (!team.department) {
      throw new BadRequestException('Team does not have an associated department.');
    }
  
    if (team.department.id !== departmentId) {
      throw new BadRequestException('Invalid team_id: Team does not belong to the provided department.');
    }
  
    // Validate that the department belongs to the correct company
    const department = await this.departmentsRepository.findOne({
      where: { id: departmentId },
      relations: { company: true }, 
    });
  
    if (!department) {
      throw new BadRequestException('Invalid department_id: Department does not exist.');
    }
  
    if (!department.company) {
      throw new BadRequestException('Department does not have an associated company.');
    }
  
    return department.company.id === companyId;
  }
  

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findUsersByCompany(companyId: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { company: { id: companyId } }, 
      relations: ['company'], 
    });
  }
  
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
  

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }
  
  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<string> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
  
    // Verify old password
    const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.hashed_password);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect old password');
    }
  
    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
  
    await this.usersRepository.update(id, { hashed_password: hashedPassword });
  
    return 'Password updated successfully';
  }

  // to be edited 
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
