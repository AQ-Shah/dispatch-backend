import { IsString, IsInt, IsNumber, IsEnum, IsOptional, IsArray } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  invoice_number: string;

  @IsInt()
  company_id: number;

  @IsInt()
  carrier_id: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsEnum(['pending', 'paid'])
  status?: 'pending' | 'paid';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @IsInt({ each: true })
  dispatch_ids: number[];
}
