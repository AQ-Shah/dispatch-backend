import { PartialType } from '@nestjs/mapped-types';
import { CreateCarrierDispatchLinkDto } from './create-carrier-link.dto';

export class EditCarrierDispatchLinkDto extends PartialType(CreateCarrierDispatchLinkDto) {}
