import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientRepository } from './ingredients.repository';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './ingredients.entity';
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
    const found = await this.ingredientRepository.getIngredientById(id);

    return found;
  }

  // recipeIdからingredientsを取得
  async getIngredientByRecipeId(recipeId: number): Promise<Ingredient[]> {
    const found = await this.ingredientRepository.getIngredientByRecipeId(
      recipeId,
    );

    return found;
  }

  async createIngredient(
    createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientRepository.createIngredient(createIngredientDto);
  }

  async createIngredients(
    createIngredientDtos: CreateIngredientDto[],
  ): Promise<Ingredient[]> {
    const newIngredients = Promise.all(
      createIngredientDtos.map(async (createIngredientDto) => {
        const newIngredient = await this.ingredientRepository.createIngredient(
          createIngredientDto,
        );
        return newIngredient;
      }),
    );
    return newIngredients;
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

  async deleteIngredientsByRecipeId(recipeId: number): Promise<MyKnownMessage> {
    const targetIngredients = await this.getIngredientByRecipeId(recipeId);

    if (targetIngredients.length > 0) {
      targetIngredients.map(
        async (targetIngredient) =>
          await this.ingredientRepository.delete({ id: targetIngredient.id }),
      );
      return { message: '材料を削除しました' };
    }
  }
}
