import { EntityRepository, Repository, getCustomRepository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { GetRecipesFilterDto } from './dto/get-recipes.dto';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { IngredientRepository } from 'src/ingredients/ingredient.repository';

@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe> {
  // TODO: Ingredientsテーブルをleft joinする
  // return recipes => RecipeとIngredientsが入ってるようにする
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

    ingredients.map((ingredient) =>
      ingredientRepository.createIngredient({
        ...ingredient,
        recipe: newRecipe,
      }),
    );
    delete recipe.user;
    delete recipe.ingredients;

    return recipe;
  }
}
