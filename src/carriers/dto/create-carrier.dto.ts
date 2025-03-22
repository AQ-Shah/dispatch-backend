import { IsOptional, IsString, IsNumber, IsEnum, IsEmail } from 'class-validator';

export class CreateCarrierDto {
  @IsNumber()
  company_id: number;

  @IsNumber()
  creator_id: number;

  @IsOptional()
  @IsNumber()
  sales_team_id?: number;

  @IsOptional()
  @IsNumber()
  dispatch_team_id?: number;

  @IsOptional()
  @IsEnum(['Engaged', 'Paused', 'Discontinued', 'Flagged'])
  status?: string;

  @IsOptional()
  @IsString()
  status_change_reason?: string;

  @IsOptional()
  @IsString()
  c_name?: string;

  @IsOptional()
  @IsEmail()
  c_email?: string;

  @IsOptional()
  @IsString()
  c_address_1?: string;

  @IsOptional()
  @IsString()
  c_address_2?: string;

  @IsOptional()
  @IsString()
  c_state?: string;

  @IsOptional()
  @IsString()
  c_zipcode?: string;

  @IsOptional()
  @IsString()
  dot_number?: string;

  @IsOptional()
  @IsString()
  mc_number?: string;

  @IsOptional()
  @IsString()
  dba?: string;

  @IsOptional()
  @IsNumber()
  owner_id?: number;

  @IsOptional()
  @IsNumber()
  sale_matured_dispatch_id?: number;
}
