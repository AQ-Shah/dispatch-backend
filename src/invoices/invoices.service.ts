import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Invoice } from './invoices.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Dispatch } from '../dispatches/dispatches.entity';
import { Carrier } from '../carriers/carriers.entity';
import { Company } from '../companies/companies.entity';
import { CarrierDispatchLink } from '../carrier_dispatch_links/carrier_dispatch_links.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,

    @InjectRepository(Dispatch)
    private dispatchRepo: Repository<Dispatch>,

    @InjectRepository(Carrier)
    private carrierRepo: Repository<Carrier>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    @InjectRepository(CarrierDispatchLink)
    private linkRepo: Repository<CarrierDispatchLink>,
  ) {}

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepo.find({ relations: ['carrier', 'company', 'dispatches'] });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
      relations: ['carrier', 'company', 'dispatches'],
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const carrier = await this.carrierRepo.findOne({ where: { id: dto.carrier_id } });
    const company = await this.companyRepo.findOne({ where: { id: dto.company_id } });

    if (!carrier || !company) throw new BadRequestException('Invalid carrier or company');

    const dispatches = await this.dispatchRepo.find({
      where: { id: In(dto.dispatch_ids), status: 'completed', invoice_status: 'ready_for_invoice' },
    });

    if (dispatches.length !== dto.dispatch_ids.length) {
      throw new BadRequestException('Some dispatches are not eligible for invoicing');
    }

    // Get percentage cut from carrier_dispatch_link
    const link = await this.linkRepo.findOne({
      where: {
        carrier: { id: dto.carrier_id },
        dispatchCompany: { id: dto.company_id },
      },
    });

    if (!link) throw new BadRequestException('Carrier is not linked with this dispatch company');
    const percentage = link.percentage_cut;

    // Total = SUM of dispatch.rate * percentage
    const totalAmount = dispatches.reduce((sum, d) => {
      return sum + (d.rate * (percentage / 100));
    }, 0);

    // Create invoice
    const invoice = this.invoiceRepo.create({
      invoice_number: dto.invoice_number,
      company,
      carrier,
      amount: totalAmount,
      status: dto.status || 'pending',
      notes: dto.notes,
      dispatches,
    });

    const saved = await this.invoiceRepo.save(invoice);

    // Update dispatches to mark them as invoiced
    for (const dispatch of dispatches) {
      dispatch.invoice_status = 'invoiced';
      dispatch.invoice = saved;
      await this.dispatchRepo.save(dispatch);
    }

    return saved;
  }

  async update(id: number, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    await this.invoiceRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepo.remove(invoice);
  }
}
