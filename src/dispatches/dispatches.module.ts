import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchService } from './dispatches.service';
import { DispatchController } from './dispatches.controller';
import { Dispatch } from './dispatches.entity';
import { Carrier } from '../carriers/carriers.entity';
import { Company } from '../companies/companies.entity';
import { Truck } from '../trucks/trucks.entity';
import { User } from '../users/users.entity';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Dispatch, Carrier, Company, Truck, User]),AuthModule
  ],
  controllers: [DispatchController],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
