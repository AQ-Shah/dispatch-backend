import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarriersService } from './carriers.service';
import { CarriersController } from './carriers.controller';
import { Carrier } from './carriers.entity';
import { User } from '../users/users.entity';
import { Company } from '../companies/companies.entity';
import { AuthModule } from '../auth/auth.module';
import { TeamsModule } from '../teams/teams.module';  
import { UsersModule } from '../users/users.module';  

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrier, User, Company]),
    AuthModule,
    TeamsModule,  
    UsersModule, 
  ],
  controllers: [CarriersController],
  providers: [CarriersService],
  exports: [CarriersService],
})
export class CarriersModule {}
