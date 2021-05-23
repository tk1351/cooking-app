import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { RecipeDescription } from './recipe-descriptions.entity';
import { CreateRecipeDescriptionDto } from './dto/create-recipe-description.dto';

@EntityRepository(RecipeDescription)
export class RecipeDescriptionRepository extends Repository<RecipeDescription> {
  async createRecipeDescription(
    createRecipeDescription: CreateRecipeDescriptionDto,
  ): Promise<RecipeDescription> {
    const { order, text, recipe } = createRecipeDescription;

    const recipeDescription = this.create();
    recipeDescription.order = order;
    recipeDescription.text = text;
    recipeDescription.recipeId = recipe.id;

    try {
      await recipeDescription.save();

      return recipeDescription;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getRecipeDescriptionsByRecipeId(
    recipeId: number,
  ): Promise<RecipeDescription[]> {
    const found = await this.createQueryBuilder('recipe-descriptions')
      .where('recipe-descriptions.recipeId = :recipeId', { recipeId })
      .getMany();

    return found;
  }
}
