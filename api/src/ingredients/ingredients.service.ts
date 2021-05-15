import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientRepository } from './ingredient.repository';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './ingredient.entity';
import { MyKnownMessage } from '../message.interface';

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

  async createIngredient(
    createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientRepository.createIngredient(createIngredientDto);
  }

  async updateIngredient(
    id: number,
    createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    const found = await this.getIngredientById(id);
    const { name } = createIngredientDto;

    found.name = name;

    await found.save();
    return found;
  }

  async deleteIngredient(id: number): Promise<MyKnownMessage> {
    const result = await this.ingredientRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のingredientは存在しません`);
    }

    return { message: '材料を削除しました' };
  }
}
