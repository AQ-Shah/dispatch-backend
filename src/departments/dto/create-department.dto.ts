import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  dispatch_c_id: number;

  @IsInt()
  @IsOptional()
  carrier_id: number;

}
