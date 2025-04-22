import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrierDispatchLinksService } from './carrier_dispatch_links.service';
import { CarrierDispatchLinksController } from './carrier_dispatch_links.controller';
import { CarrierDispatchLink } from './carrier_dispatch_links.entity';
import { User } from '../users/users.entity';
import { Company } from '../companies/companies.entity';
import { AuthModule } from '../auth/auth.module';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarrierDispatchLink, User, Company]),
    AuthModule,
    TeamsModule,
    UsersModule,
  ],
  controllers: [CarrierDispatchLinksController],
  providers: [CarrierDispatchLinksService],
  exports: [CarrierDispatchLinksService],
})
export class CarrierDispatchLinksModule {}
