import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';
import { Permission } from '../permissions/permissions.entity';
import { JwtModule, JwtService } from '@nestjs/jwt'; 
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserPermissionsModule } from '../user_permissions/user_permissions.module'; 



@Module({
  imports: [
    ConfigModule,
    UserPermissionsModule, 
    TypeOrmModule.forFeature([User, Role, Permission]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, JwtService, ],  
  exports: [AuthService, JwtAuthGuard, JwtService, ], 
})
export class AuthModule {}
