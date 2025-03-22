import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchService } from './dispatches.service';
import { DispatchController } from './dispatches.controller';
import { Dispatch } from './dispatches.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dispatch])],
  controllers: [DispatchController],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
