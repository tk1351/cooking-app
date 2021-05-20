import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientRepository } from './ingredient.repository';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './ingredient.entity';
import { MyKnownMessage } from '../message.interface';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientRepository)
    private ingredientRepository: IngredientRepository,
  ) {}

  async getAllIngredients(): Promise<Ingredient[]> {
    return await this.ingredientRepository.find({});
  }

  async getIngredientById(id: number): Promise<Ingredient> {
    const found = await this.ingredientRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`ID: ${id}のingredientは存在しません`);
    }

    return found;
  }

  // recipeIdからingredientsを取得
  async getIngredientByRecipeId(recipeId: number): Promise<Ingredient[]> {
    const found = await this.ingredientRepository
      .createQueryBuilder('ingredients')
      .where('ingredients.recipeId = :recipeId', { recipeId })
      .getMany();

    if (!found) {
      throw new NotFoundException(
        `RecipeID: ${recipeId}のingredientは存在しません`,
      );
    }

    return found;
  }

  async createIngredient(
    createIngredientDto: CreateIngredientDto,
  ): Promise<MyKnownMessage> {
    return this.ingredientRepository.createIngredient(createIngredientDto);
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
    const result = await this.ingredientRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のingredientは存在しません`);
    }

    return { message: '材料を削除しました' };
  }
}
