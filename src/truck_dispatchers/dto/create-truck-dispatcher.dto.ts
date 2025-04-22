import { IsInt } from 'class-validator';

export class CreateTruckDispatcherDto {
  @IsInt()
  truck_id: number;

  @IsInt()
  dispatcher_user_id: number;
}
