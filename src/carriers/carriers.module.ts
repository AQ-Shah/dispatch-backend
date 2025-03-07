import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarriersService } from './carriers.service';
import { CarriersController } from './carriers.controller';
import { Carrier } from './carriers.entity';
import { User } from '../users/users.entity';
import { Company } from '../companies/companies.entity';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrier, User, Company]), 
    AuthModule, 
  ],
  controllers: [CarriersController],
  providers: [CarriersService],
  exports: [CarriersService],
})
export class CarriersModule {}
