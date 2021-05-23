import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Ingredient } from './ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
  async createIngredient(
    createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    const { name, amount, recipe } = createIngredientDto;

    const ingredient = this.create();
    ingredient.name = name;
    ingredient.amount = amount;
    ingredient.recipeId = recipe.id;

    try {
      await ingredient.save();

      return ingredient;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getIngredientById(id: number): Promise<Ingredient> {
    const found = await this.findOne(id);

    return found;
  }

  async getIngredientByRecipeId(recipeId: number): Promise<Ingredient[]> {
    const found = await this.createQueryBuilder('ingredients')
      .where('ingredients.recipeId = :recipeId', { recipeId })
      .getMany();

    return found;
  }
}
