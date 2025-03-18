import { IsInt, IsNotEmpty } from 'class-validator';

export class RemoveRoleDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  role_id: number;
}
