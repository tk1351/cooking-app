import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag-dto';
import { MyKnownMessage } from '../message.interface';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async createTag(createTagDto: CreateTagDto): Promise<MyKnownMessage> {
    const { name, recipe } = createTagDto;

    const tag = this.create();
    tag.name = name;
    tag.recipe = recipe;

    try {
      await tag.save();

      delete tag.recipe;

      return { message: 'タグの登録が完了しました' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
