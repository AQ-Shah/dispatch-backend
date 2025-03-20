import { IsNumber } from 'class-validator';

export class RemovePermissionDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  permissionId: number;
}
