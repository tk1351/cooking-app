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
    return this.tagRepository.find({});
  }

  async getTagById(id: number): Promise<Tag> {
    const found = await this.tagRepository.findOne(id);

    return found;
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

  async deleteTagsByRecipeId(recipeId: number): Promise<MyKnownMessage> {
    const targetTags = await this.getTagsByRecipeId(recipeId);

    if (targetTags.length > 0) {
      targetTags.map(
        async (targetTag) =>
          await this.tagRepository.delete({
            id: targetTag.id,
          }),
      );
      return { message: 'タグを削除しました' };
    }
  }
}
