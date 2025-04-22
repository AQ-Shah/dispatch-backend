import { IsString, IsEmail, IsOptional, MinLength, IsEnum, IsNumber, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string; 

  @IsOptional()
  @IsString()
  username: string;
  
  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsNumber()
  role_id?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  emergency_phone?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsInt()
  dispatch_c_id?: number;
  
  @IsOptional()
  @IsInt()
  carrier_id?: number;
  
  @IsOptional()
  @IsNumber()
  department_id?: number;

  @IsOptional()
  @IsNumber()
  team_id?: number;

  @IsOptional()
  @IsEnum(['employed', 'resigned', 'terminated'])
  current_status?: string;

  @IsOptional()
  @IsString()
  photo_path?: string;


}
