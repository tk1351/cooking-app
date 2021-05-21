import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagRepository } from './tag.repository';
import { CreateTagDto } from './dto/create-tag-dto';
import { MyKnownMessage } from '../message.interface';
import { Tag } from './tag.entity';
import { UpdateTagDto } from './dto/update-tag-dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
  ) {}

  async getAllTags(): Promise<Tag[]> {
    return this.tagRepository.find({});
  }

  async getTagById(id: number): Promise<Tag> {
    const found = await this.tagRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`ID: ${id}のtagは存在しません`);
    }

    return found;
  }

  async getTagsByRecipeId(recipeId: number): Promise<Tag[]> {
    const found = await this.tagRepository
      .createQueryBuilder('tags')
      .where('tags.recipeId = :recipeId', { recipeId })
      .getMany();

    if (!found || found.length === 0) {
      throw new NotFoundException(`RecipeId: ${recipeId}のtagsは存在しません`);
    }

    return found;
  }

  async createTag(createTagDto: CreateTagDto): Promise<MyKnownMessage> {
    return this.tagRepository.createTag(createTagDto);
  }

  async updateTag(
    id: number,
    updateTagDto: UpdateTagDto,
  ): Promise<MyKnownMessage> {
    const found = await this.getTagById(id);
    const { name } = updateTagDto;

    found.name = name;

    await found.save();
    return { message: 'タグ名の更新が完了しました' };
  }

  async deleteTag(id: number): Promise<MyKnownMessage> {
    const result = await this.tagRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のtagは存在しません`);
    }

    return { message: 'タグを削除しました' };
  }
}
