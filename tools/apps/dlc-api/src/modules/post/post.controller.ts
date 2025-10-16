import { Controller, Post, Get, Body } from '@nestjs/common';
import { PostService } from './post.service';
import { CreateLogDto, LogResponseDto } from './post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('logs')
  async createLog(@Body() body: CreateLogDto): Promise<LogResponseDto> {
    return this.postService.createLog(body);
  }

  @Get('logs')
  async getLogs(): Promise<LogResponseDto[]> {
    return this.postService.getLogs();
  }
}
