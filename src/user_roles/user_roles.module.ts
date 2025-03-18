import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesService } from './user_roles.service';
import { UserRolesController } from './user_roles.controller';
import { UserRole } from './user_roles.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/users.entity'; 
import { Role } from '../roles/roles.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, User, Role]), AuthModule], 
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
