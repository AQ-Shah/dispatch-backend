import { PartialType } from '@nestjs/mapped-types';
import { CreateTruckDispatcherDto } from './create-truck-dispatcher.dto';

export class UpdateTruckDispatcherDto extends PartialType(CreateTruckDispatcherDto) {}
