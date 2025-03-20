import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionsService } from './user_permissions.service';
import { UserPermissionsController } from './user_permissions.controller';
import { UserPermission } from './user_permissions.entity';
import { User } from '../users/users.entity';
import { Permission } from '../permissions/permissions.entity';
import { Role } from '../roles/roles.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermission, User, Permission, Role]),JwtModule ],  
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService],
  exports: [UserPermissionsService, TypeOrmModule],  
})
export class UserPermissionsModule {}
