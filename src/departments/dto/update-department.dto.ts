import { IsString, IsNotEmpty, isString } from 'class-validator';

export class UpdateDepartmentDto {
  
  @IsString()
  @IsNotEmpty()
  name?:string;

}
