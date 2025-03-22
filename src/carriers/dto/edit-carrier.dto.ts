import { CreateCarrierDto } from './create-carrier.dto';
import { PartialType } from '@nestjs/mapped-types';

export class EditCarrierDto extends PartialType(CreateCarrierDto) {}
