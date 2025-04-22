import {
    IsString,
    IsDateString,
    IsNumber,
    IsEnum,
    IsOptional,
    IsInt,
  } from 'class-validator';
  
  export class CreateDispatchDto {
    @IsString()
    load_number: string;
  
    @IsString()
    pickup_location: string;
  
    @IsDateString()
    pickup_datetime: Date;
  
    @IsString()
    dropoff_location: string;
  
    @IsDateString()
    dropoff_datetime: Date;
  
    @IsOptional()
    @IsString()
    broker_name?: string;
  
    @IsNumber()
    rate: number;
  
    @IsString()
    commodity: string;
  
    @IsString()
    trailer_type: string;
  
    @IsOptional()
    @IsString()
    notes?: string;
  
    @IsOptional()
    @IsEnum(['pending', 'active', 'completed', 'cancelled'])
    status?: string;
  
    @IsInt()
    carrier_id: number;
  
    @IsInt()
    company_id: number;
  
    @IsInt()
    truck_id: number;
  
    @IsInt()
    dispatcher_id: number;
  }
  