// src/company/dto/create-company.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
