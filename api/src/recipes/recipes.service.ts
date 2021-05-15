import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeRepository } from './recipe.repository';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.entity';
import { GetRecipesFilterDto } from './dto/get-recipes.dto';
import { MyKnownMessage } from '../message.interface';
import { User } from '../users/user.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeRepository)
    private recipeRepository: RecipeRepository,
  ) {}

  async getRecipes(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipes(getRecipesFilterDto);
  }

  async getRecipeById(id: number): Promise<Recipe> {
    const found = await this.recipeRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`ID: ${id}のrecipeは存在しません`);
    }
    return found;
  }

  async createRecipe(
    createRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    return this.recipeRepository.createRecipe(createRecipeDto, user);
  }

  async updateRecipe(
    id: number,
    createRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }
    const found = await this.getRecipeById(id);
    const { name, time, remarks, image } = createRecipeDto;

    found.name = name;
    found.time = time;
    found.remarks = remarks;
    found.image = image;

    await found.save();
    return found;
  }

  async deleteRecipe(id: number, user: User): Promise<MyKnownMessage> {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }
    const result = await this.recipeRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のrecipeは存在しません`);
    }

    return { message: 'レシピを削除しました' };
  }
}
