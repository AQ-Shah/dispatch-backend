import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCarrierDto {
  @IsOptional()
  @IsEnum(['Engaged', 'Paused', 'Discontinued', 'Flagged'])
  status?: string;

  @IsOptional()
  @IsNumber()
  dispatch_team_id?: number;

  @IsOptional()
  @IsString()
  status_change_reason?: string;
}
