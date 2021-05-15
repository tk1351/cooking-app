import { EntityRepository, Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { GetRecipesFilterDto } from './dto/get-recipes.dto';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';

@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe> {
  async getRecipes(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    const { query } = getRecipesFilterDto;

    const result = this.createQueryBuilder('recipe');

    if (query) {
      // SQL
    }

    const recipes = await result.getMany();
    return recipes;
  }

  async createRecipe(
    createRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }

    const { name, time, remarks, image } = createRecipeDto;

    const recipe = this.create();
    recipe.name = name;
    recipe.time = time;
    recipe.remarks = remarks;
    recipe.image = image;
    recipe.user = user;

    await recipe.save();

    delete recipe.user;

    return recipe;
  }
}
