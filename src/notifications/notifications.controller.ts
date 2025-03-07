import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './notifications.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number): Promise<Notification[]> {
    return this.notificationsService.findByUser(userId);
  }

  @Post()
  create(@Body() notificationData: Notification): Promise<Notification> {
    return this.notificationsService.create(notificationData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.notificationsService.remove(id);
  }
}
