import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ForumService } from './forum_subjects.service';
import { Forum } from './forum_subjects.entity';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get()
  findAll(): Promise<Forum[]> {
    return this.forumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Forum> {
    return this.forumService.findOne(id);
  }

  @Post()
  create(@Body() forumData: Forum): Promise<Forum> {
    return this.forumService.create(forumData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.forumService.remove(id);
  }
}
