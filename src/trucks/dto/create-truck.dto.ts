import { IsOptional, IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateTruckDto {
  @IsString()
  truck_number: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  plate_number?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsInt()
  carrier_id: number;

  @IsOptional()
  @IsInt()
  driver_user_id?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
