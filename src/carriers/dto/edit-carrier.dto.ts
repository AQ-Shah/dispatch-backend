import { PartialType } from '@nestjs/mapped-types';
import { CreateCarrierDto } from './create-carrier.dto';

export class EditCarrierDto extends PartialType(CreateCarrierDto) {}
