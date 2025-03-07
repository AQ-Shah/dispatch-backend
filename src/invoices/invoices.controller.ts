import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoices.entity';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(): Promise<Invoice[]> {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Invoice> {
    return this.invoicesService.findOne(id);
  }

  @Post()
  create(@Body() invoiceData: Invoice): Promise<Invoice> {
    return this.invoicesService.create(invoiceData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.invoicesService.remove(id);
  }
}
