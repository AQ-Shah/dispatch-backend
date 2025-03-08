import { IsString, IsOptional, IsEmail, MinLength, IsDate, IsEnum, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  designation?: string;

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
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsDate()
  join_date?: Date;

  @IsOptional()
  @IsDate()
  leaving_date?: Date;

  @IsOptional()
  @IsEnum(['employed', 'resigned', 'terminated'])
  current_status?: string;

  @IsOptional()
  @IsString()
  photo_path?: string;

  @IsOptional()
  @IsString()
  department_id?: string;

  @IsOptional()
  @IsString()
  team_id?: string;

}
