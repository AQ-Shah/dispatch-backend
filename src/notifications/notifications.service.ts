import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  findAll(): Promise<Notification[]> {
    return this.notificationsRepository.find();
  }

  findByUser(userId: number): Promise<Notification[]> {
    return this.notificationsRepository.find({ where: { user_id: userId } });
  }

  create(notificationData: Notification): Promise<Notification> {
    return this.notificationsRepository.save(notificationData);
  }

  async remove(id: number): Promise<void> {
    await this.notificationsRepository.delete(id);
  }
}
