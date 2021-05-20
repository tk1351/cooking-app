import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Ingredient } from './ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { MyKnownMessage } from '../message.interface';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
  async createIngredient(
    createIngredientDto: CreateIngredientDto,
  ): Promise<MyKnownMessage> {
    const { name, amount, recipe } = createIngredientDto;

    const ingredient = this.create();
    ingredient.name = name;
    ingredient.amount = amount;
    ingredient.recipe = recipe;

    try {
      await ingredient.save();

      delete ingredient.recipe;

      return { message: '材料の登録が完了しました' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
