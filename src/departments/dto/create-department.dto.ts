// src/company/dto/create-company.dto.ts
import { IsString, IsNotEmpty, isInt, isNotEmpty, IsInt } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  company_id: number;

}
