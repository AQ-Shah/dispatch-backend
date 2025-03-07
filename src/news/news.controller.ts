import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './news.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findAll(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<News> {
    return this.newsService.findOne(id);
  }

  @Post()
  create(@Body() newsData: News): Promise<News> {
    return this.newsService.create(newsData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.newsService.remove(id);
  }
}
