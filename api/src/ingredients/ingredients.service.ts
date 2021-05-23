import { Injectable } from '@nestjs/common';
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
    return await this.ingredientRepository.getAllIngredients();
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
    return await this.ingredientRepository.updateIngredient(
      id,
      updateIngredientDto,
    );
  }

  async deleteIngredient(id: number): Promise<MyKnownMessage> {
    return await this.ingredientRepository.deleteIngredient(id);
  }

  async deleteIngredientsByRecipeId(recipeId: number): Promise<MyKnownMessage> {
    return await this.ingredientRepository.deleteIngredientsByRecipeId(
      recipeId,
    );
  }
}
