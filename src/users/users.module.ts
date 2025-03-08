import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { Company } from '@app/companies/companies.entity';
import { Department } from '@app/departments/departments.entity';
import { Team } from '@app/teams/teams.entity';
import { CompaniesModule } from '@app/companies/companies.module';
import { DepartmentsModule } from '../departments/departments.module';
import { TeamsModule } from '../teams/teams.module';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([User, Company, Department, Team]),AuthModule, CompaniesModule, DepartmentsModule, TeamsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
