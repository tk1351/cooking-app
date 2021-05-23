import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Tag } from './tags.entity';
import { CreateTagDto } from './dto/create-tag-dto';
import { UpdateTagDto } from './dto/update-tag-dto';
import { MyKnownMessage } from '../message.interface';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async getAllTags(): Promise<Tag[]> {
    return this.find({});
  }

  async getTagById(id: number): Promise<Tag> {
    const found = await this.findOne(id);

    return found;
  }

  async getTagsByRecipeId(recipeId: number): Promise<Tag[]> {
    const found = await this.createQueryBuilder('tags')
      .where('tags.recipeId = :recipeId', { recipeId })
      .getMany();

    return found;
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const { name, recipe } = createTagDto;

    const tag = this.create();
    tag.name = name;
    tag.recipeId = recipe.id;

    try {
      await tag.save();

      return tag;
    } catch (error) {
      throw new InternalServerErrorException();
    }
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
    const result = await this.delete({ id });

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
          await this.delete({
            id: targetTag.id,
          }),
      );
      return { message: 'タグを削除しました' };
    }
  }
}
