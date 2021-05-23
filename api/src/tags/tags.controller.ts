import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag-dto';
import { MyKnownMessage } from '../message.interface';
import { Tag } from './tag.entity';
import { UpdateTagDto } from './dto/update-tag-dto';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  getAllTags(): Promise<Tag[]> {
    return this.tagsService.getAllTags();
  }

  @Get('/:id')
  getTagById(@Param('id', ParseIntPipe) id: number): Promise<Tag> {
    return this.tagsService.getTagById(id);
  }

  @Get('/:recipeId/recipe')
  getTagsByRecipeId(
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ): Promise<Tag[]> {
    return this.tagsService.getTagsByRecipeId(recipeId);
  }

  @Post()
  createTag(@Body(ValidationPipe) createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.createTag(createTagDto);
  }

  @Patch('/:id')
  updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTagDto: UpdateTagDto,
  ): Promise<MyKnownMessage> {
    return this.tagsService.updateTag(id, updateTagDto);
  }

  @Delete('/:id')
  deleteTag(@Param('id', ParseIntPipe) id: number): Promise<MyKnownMessage> {
    return this.tagsService.deleteTag(id);
  }
}
