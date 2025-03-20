import { IsNumber } from 'class-validator';

export class AssignPermissionDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  permissionId: number;
}
