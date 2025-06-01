import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class CreateCarrierDispatchLinkDto {
  @IsInt()
  dispatch_c_id: number;

  @IsOptional()
  @IsInt()
  creator_id?: number;

  @IsOptional()
  @IsInt()
  owner_id?: number;

  @IsOptional()
  @IsInt()
  sales_team_id?: number;

  @IsOptional()
  @IsInt()
  dispatch_team_id?: number;

  @IsOptional()
  @IsInt()
  sale_matured_dispatch_id?: number;

  @IsOptional()
  @IsEnum(['Engaged', 'Paused', 'Discontinued', 'Flagged'])
  status?: string;

  @IsOptional()
  @IsString()
  status_change_reason?: string;

  @IsOptional()
  @IsBoolean()
  sale_matured?: boolean;
}
