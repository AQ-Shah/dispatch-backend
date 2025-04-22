import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrucksService } from './trucks.service';
import { TrucksController } from './trucks.controller';
import { Truck } from './trucks.entity';
import { Carrier } from '../carriers/carriers.entity';
import { User } from '../users/users.entity';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([Truck, Carrier, User]),AuthModule],
  controllers: [TrucksController],
  providers: [TrucksService],
  exports: [TrucksService],
})
export class TrucksModule {}
