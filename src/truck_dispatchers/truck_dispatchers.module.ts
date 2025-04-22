import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TruckDispatcher } from './truck_dispatchers.entity';
import { TruckDispatchersController } from './truck_dispatchers.controller';
import { TruckDispatchersService } from './truck_dispatchers.service';
import { Truck } from '../trucks/trucks.entity';
import { User } from '../users/users.entity';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([TruckDispatcher, Truck, User]), AuthModule],
  controllers: [TruckDispatchersController],
  providers: [TruckDispatchersService],
  exports: [TruckDispatchersService],
})
export class TruckDispatchersModule {}
