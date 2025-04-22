import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './user_roles.entity';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, 
    
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<UserRole[]> {
    return this.userRolesRepository.find();
  }

  async getUserWithCompany(userId: number): Promise<{ id: number; dispatch_c_id: number } | null> {
    const result = await this.userRolesRepository
      .createQueryBuilder('user_role')
      .innerJoinAndSelect('user_role.user', 'user')
      .where('user_role.user_id = :userId', { userId })
      .select(['user.id', 'user.dispatch_c_id']) 
      .getRawOne();
    return result || null;
  }

  async findAllByCompany(companyId: number): Promise<UserRole[]> {
    return this.userRolesRepository
      .createQueryBuilder('userRole')
      .innerJoinAndSelect('userRole.user', 'user')
      .innerJoinAndSelect('userRole.role', 'role')
      .where('user.dispatch_c_id = :companyId', { companyId })
      .getMany();
  }
  

  async getUserById(userId: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async getRoleById(roleId: number): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { id: roleId } });
  }

  async assignRole(userRole: UserRole): Promise<UserRole> {
    return this.userRolesRepository.save(userRole);
  }
  

  findByUser(userId: number): Promise<UserRole[]> {
    return this.userRolesRepository.find({ where: { user_id: userId } });
  }

  async remove(userId: number, roleId: number): Promise<void> {
    await this.userRolesRepository.delete({ user_id: userId, role_id: roleId });
  }
}
