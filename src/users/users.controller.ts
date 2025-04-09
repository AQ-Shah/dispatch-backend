import { Controller, Post, Get, Put, Patch, Param, Body, Delete, UseGuards, Request, ForbiddenException, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Throttle } from '@nestjs/throttler';


@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Request() req, @Body() createUserDto: CreateUserDto) {
    const { user } = req;

    const isSuperAdmin = user.roles.includes('Super Admin');
    const canCreateCompanyUser = user.permissions.includes('create_company_users');

    if (!isSuperAdmin && !canCreateCompanyUser) {
      throw new ForbiddenException('You do not have permission to create users.');
    }

    if (!isSuperAdmin) {
      if (createUserDto.role_id === 1) {
        throw new ForbiddenException('Access denied');
      }
    }

    // If user is not Super Admin, they must provide a company_id and stay within their company
    if (!isSuperAdmin) {
      if (!createUserDto.company_id || createUserDto.company_id !== user.company.id) {
        throw new ForbiddenException('You can only create users within your company.');
      }
    }

    // If department_id is provided, ensure it belongs to the correct company
    if (!isSuperAdmin) {
      if (createUserDto.department_id) {
        const department = await this.usersService.validateDepartment(createUserDto.department_id, user.company.id);
        if (!department) {
          throw new ForbiddenException('Invalid department or department does not belong to your company.');
        }
      }
    }

    // If team_id is provided, ensure it belongs to the correct department & company
    if (!isSuperAdmin) {
      if (createUserDto.team_id && createUserDto.department_id) {
        const team = await this.usersService.validateTeam(createUserDto.team_id, createUserDto.department_id, user.company.id);
        if (!team) {
          throw new ForbiddenException('Invalid team or team does not belong to the provided department.');
        }
      }
    }
    return this.usersService.create(createUserDto);
  }


  //************** ALL THE GET DATA APIs BELOW *****************************
  @Get()
  async findAll(@Request() req): Promise<User[]> {
    const { user } = req;

    const isSuperAdmin = user.roles.includes('Super Admin');
    const canViewCompanyUsers = user.permissions.includes('view_company_users');

    if (isSuperAdmin) {
      return this.usersService.findAll(); // Get all users
    } else if (canViewCompanyUsers) {
      return this.usersService.findUsersByCompany(user.company_id); // Get users of the same company
    } else {
      throw new ForbiddenException('You do not have permission to view users.');
    }
  }


  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<User> {
    const { user } = req;

    const isSuperAdmin = user.roles.includes('Super Admin');
    const canViewCompanyUsers = user.permissions.includes('view_company_users');

    const foundUser = await this.usersService.findOne(id);

    if (isSuperAdmin) {
      return foundUser; // Super Admin can view any user
    } else if (canViewCompanyUsers) {
      if (foundUser.company.id !== user.company_id) {
        throw new ForbiddenException('You can only view users from your company.');
      }
      return foundUser; // Return user only if from same company
    } else {
      throw new ForbiddenException('You do not have permission to view this user.');
    }
  }




  //************** ALL THE GET DATA APIs ENDs *****************************

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Request() req, 
    @Param('id') id: number, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const { user } = req;

    const isSuperAdmin = user.roles.includes('Super Admin');
    const canEditCompanyUsers = user.permissions.includes('edit_company_users');

    // Fetch the user by ID
    const userToUpdate = await this.usersService.findOne(id);

    if (isSuperAdmin) {
      return this.usersService.update(id, updateUserDto); // Super Admin can update any user
    } else if (canEditCompanyUsers) {
      if (userToUpdate.company.id !== user.company_id) {
        throw new ForbiddenException('You can only update users from your company.');
      }
      return this.usersService.update(id, updateUserDto); // Allow only if in the same company
    } else {
      throw new ForbiddenException('You do not have permission to update this user.');
    }
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Patch(':id/password')
  async changePassword(
    @Request() req,
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    // Ensure user is updating their own password or is admin
    if (req.user.id !== Number(id) && !req.user.permissions.includes('manage_all_users')) {
      throw new ForbiddenException('You are not allowed to change this password');
    }
  
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number): Promise<void> {
    const { user } = req;

    const isSuperAdmin = user.roles.includes('Super Admin');
    const canDeleteCompanyUsers = user.permissions.includes('delete_company_users');

    const userToDelete = await this.usersService.findOne(id);

    if (isSuperAdmin) {
      return this.usersService.remove(id); 
    } else if (canDeleteCompanyUsers) {
      if (userToDelete.company.id !== user.company_id) {
        throw new ForbiddenException('You can only delete users from your company.');
      }
      return this.usersService.remove(id); 
    } else {
      throw new ForbiddenException('You do not have permission to delete this user.');
    }
  }

}
