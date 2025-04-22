import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoices.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async findAll(@Request() req): Promise<Invoice[]> {
    const user = req.user;
    const isAdmin = user.roles.includes('Super Admin');
    const isDispatch = !!user.dispatch_c_id;

    if (!isAdmin && !isDispatch) {
      throw new ForbiddenException('You are not authorized to view invoices');
    }

    return this.invoicesService.findAll();
  }

  @Get(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async findOne(@Request() req, @Param('id') id: number): Promise<Invoice> {
    const user = req.user;
    const invoice = await this.invoicesService.findOne(id);
    if (!invoice) throw new NotFoundException('Invoice not found');

    const isAdmin = user.roles.includes('Super Admin');
    const ownsInvoice = invoice.company?.id === user.dispatch_c_id;

    if (!isAdmin && !ownsInvoice) {
      throw new ForbiddenException('You do not have permission to view this invoice');
    }

    return invoice;
  }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Request() req, @Body() dto: CreateInvoiceDto): Promise<Invoice> {
    const user = req.user;
    const isAdmin = user.roles.includes('Super Admin');
    const isDispatch = !!user.dispatch_c_id;

    if (!isAdmin && !isDispatch) {
      throw new ForbiddenException('You are not authorized to create invoices');
    }

    // Auto-fill company_id for dispatch users
    if (!isAdmin) {
      dto.company_id = user.dispatch_c_id;
    }

    return this.invoicesService.create(dto);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async remove(@Request() req, @Param('id') id: number): Promise<void> {
    const user = req.user;
    const invoice = await this.invoicesService.findOne(id);
    if (!invoice) throw new NotFoundException('Invoice not found');

    const isAdmin = user.roles.includes('Super Admin');
    const ownsInvoice = invoice.company?.id === user.dispatch_c_id;

    if (!isAdmin && !ownsInvoice) {
      throw new ForbiddenException('You are not authorized to delete this invoice');
    }

    return this.invoicesService.remove(id);
  }
}
