import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumService } from './forum_subjects.service';
import { ForumController } from './forum_subjects.controller';
import { Forum } from './forum_subjects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forum])],
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService],
})
export class ForumModule {}
