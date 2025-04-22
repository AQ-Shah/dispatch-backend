import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateCarrierDto {
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  mc_number?: string;

  @IsOptional()
  @IsString()
  dot_number?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip_code?: string;

  @IsOptional()
  @IsString()
  dba?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  owner_user_id?: number;
}
