import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Tag } from './tags.entity';
import { CreateTagDto } from './dto/create-tag-dto';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
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

  async getTagsByRecipeId(recipeId: number): Promise<Tag[]> {
    const found = await this.createQueryBuilder('tags')
      .where('tags.recipeId = :recipeId', { recipeId })
      .getMany();

    return found;
  }
}
