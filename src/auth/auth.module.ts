import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';
import { JwtModule, JwtService } from '@nestjs/jwt'; 
import { PassportModule } from '@nestjs/passport';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, JwtService],  
  exports: [AuthService, JwtAuthGuard, JwtService], 
})
export class AuthModule {}
