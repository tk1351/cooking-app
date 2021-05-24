import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagRepository } from './tags.repository';
import { CreateTagDto } from './dto/create-tag-dto';
import { MyKnownMessage } from '../message.interface';
import { Tag } from './tags.entity';
import { UpdateTagDto } from './dto/update-tag-dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
  ) {}

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepository.getAllTags();
  }

  async getTagById(id: number): Promise<Tag> {
    return await this.tagRepository.getTagById(id);
  }

  async getTagsByRecipeId(recipeId: number): Promise<Tag[]> {
    const found = await this.tagRepository.getTagsByRecipeId(recipeId);

    return found;
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagRepository.createTag(createTagDto);
  }

  async createTags(createTagDtos: CreateTagDto[]): Promise<Tag[]> {
    const newTags = Promise.all(
      createTagDtos.map(async (createTagDto) => {
        const newTag = await this.tagRepository.createTag(createTagDto);
        return newTag;
      }),
    );
    return newTags;
  }

  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    return await this.tagRepository.updateTag(id, updateTagDto);
  }

  async deleteTag(id: number): Promise<MyKnownMessage> {
    return await this.tagRepository.deleteTag(id);
  }

  async deleteTagsByRecipeId(recipeId: number): Promise<MyKnownMessage> {
    return await this.tagRepository.deleteTagsByRecipeId(recipeId);
  }
}
