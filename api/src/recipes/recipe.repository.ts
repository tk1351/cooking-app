import { EntityRepository, Repository, getCustomRepository } from 'typeorm';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { GetRecipesFilterDto } from './dto/get-recipes.dto';
import { User } from '../users/user.entity';
import { IngredientRepository } from '../ingredients/ingredient.repository';

@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe> {
  async getRecipes(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    const { query } = getRecipesFilterDto;

    const result = this.createQueryBuilder('recipes');

    if (query) {
      // recipes.nameに一致するqueryを取得する
      result.andWhere('recipes.name LIKE :query', { query: `%${query}%` });
    }

    // TODO: recipes.ingredients[]にあるnameも検索できるようにする

    try {
      const recipes = await result
        .leftJoinAndSelect('recipes.ingredients', 'ingredients')
        .getMany();
      return recipes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createRecipe(
    createRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<any> {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }

    const { name, time, remarks, image, ingredients } = createRecipeDto;

    const recipe = this.create();

    const ingredientRepository = getCustomRepository(IngredientRepository);

    recipe.name = name;
    recipe.time = time;
    recipe.remarks = remarks;
    recipe.image = image;
    recipe.user = user;
    recipe.ingredients = ingredients;

    const newRecipe = await recipe.save();

    // 配列で渡されるingredientsのrecipeIdをingredientテーブルに渡すためmapを回す
    ingredients.map((ingredient) =>
      ingredientRepository.createIngredient({
        ...ingredient,
        recipe: newRecipe,
      }),
    );
    delete recipe.user;

    return recipe;
  }
}