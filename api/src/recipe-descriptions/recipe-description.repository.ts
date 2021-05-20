import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { RecipeDescription } from './recipe-description.entity';
import { CreateRecipeDescriptionDto } from './dto/create-recipe-description.dto';
import { MyKnownMessage } from '../message.interface';

@EntityRepository(RecipeDescription)
export class RecipeDescriptionRepository extends Repository<RecipeDescription> {
  async createRecipeDescription(
    createRecipeDescription: CreateRecipeDescriptionDto,
  ): Promise<MyKnownMessage> {
    const { order, text, recipe } = createRecipeDescription;

    const recipeDescription = this.create();
    recipeDescription.order = order;
    recipeDescription.text = text;
    recipeDescription.recipe = recipe;

    try {
      await recipeDescription.save();

      delete recipeDescription.recipe;

      return { message: '作業工程の詳細の登録が完了しました' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
