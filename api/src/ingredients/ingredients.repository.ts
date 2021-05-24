import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Ingredient } from './ingredients.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { MyKnownMessage } from '../message.interface';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
  async getAllIngredients(): Promise<Ingredient[]> {
    return await this.find({});
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

  async updateIngredient(
    id: number,
    updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    const found = await this.getIngredientById(id);
    const { name, amount } = updateIngredientDto;

    found.name = name;
    found.amount = amount;

    await found.save();
    return found;
  }

  async deleteIngredient(id: number): Promise<MyKnownMessage> {
    const result = await this.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のingredientは存在しません`);
    }

    return { message: '材料を削除しました' };
  }

  async deleteIngredientsByRecipeId(recipeId: number): Promise<MyKnownMessage> {
    const targetIngredients = await this.getIngredientByRecipeId(recipeId);

    if (targetIngredients.length > 0) {
      targetIngredients.map(
        async (targetIngredient) =>
          await this.delete({ id: targetIngredient.id }),
      );
      return { message: '材料を削除しました' };
    }
  }
}
