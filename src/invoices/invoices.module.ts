import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './invoices.entity';
import { Dispatch } from '../dispatches/dispatches.entity';
import { Carrier } from '../carriers/carriers.entity';
import { Company } from '../companies/companies.entity';
import { CarrierDispatchLink } from '../carrier_dispatch_links/carrier_dispatch_links.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      Dispatch,
      Carrier,
      Company,
      CarrierDispatchLink,
    ]),
    JwtModule, 
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
