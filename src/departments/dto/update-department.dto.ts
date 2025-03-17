// src/company/dto/create-company.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateDepartmentDto {
 
  @IsNotEmpty()
  name?:string;

}
