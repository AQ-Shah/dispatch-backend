import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { CarriersModule } from './carriers/carriers.module';
import { UsersModule } from './users/users.module';
import { TrucksModule } from './trucks/trucks.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { FilesModule } from './files/files.module';
import { NewsModule } from './news/news.module';
import { ForumModule } from './forum/forum.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role_permissions/role_permissions.module';
import { UserPermissionsModule } from './user_permissions/user_permissions.module';
import { UserRolesModule } from './user_roles/user_roles.module';
import { DepartmentsModule } from './departments/departments.module';
import { TeamsModule } from './teams/teams.module';
import { Carrier } from './carriers/carriers.entity';
import { User } from './users/users.entity';
import { Department } from './departments/departments.entity';
import { Company } from './companies/companies.entity'; 
import { AuthGuard } from './auth/auth.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      driver: require('mysql2'),
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Carrier, User, Department, Company], 
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Carrier, User, Department, Company]),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
    AuthModule,
    CompaniesModule,
    CarriersModule,
    UsersModule,
    TrucksModule,
    InvoicesModule,
    DispatchModule,
    FilesModule,
    NewsModule,
    ForumModule,
    NotificationsModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    UserPermissionsModule,
    UserRolesModule,
    DepartmentsModule,
    TeamsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],  
  providers: [AuthGuard, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
