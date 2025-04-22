import { PartialType } from '@nestjs/mapped-types';
import { CreateCarrierDispatchLinkDto } from './create-carrier-link.dto';

export class UpdateCarrierDispatchLinkDto extends PartialType(CreateCarrierDispatchLinkDto) {}
