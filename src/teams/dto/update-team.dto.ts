import { IsString,IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTeamDto {
 
    @IsString()
    @IsNotEmpty()
    name?:string;

    @IsInt()
    @IsOptional()
    department_id: number;

}
