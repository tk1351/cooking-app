import { EntityRepository, Repository, getCustomRepository } from 'typeorm';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { GetRecipesFilterDto } from './dto/get-recipes.dto';
import { User } from '../users/user.entity';
import { IngredientRepository } from '../ingredients/ingredients.repository';
import { RecipeDescriptionRepository } from '../recipe-descriptions/recipe-description.repository';
import { TagRepository } from '../tags/tag.repository';

@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe> {
  async getRecipes(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    const { query } = getRecipesFilterDto;

    const result = this.createQueryBuilder('recipes')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipes.recipeLikes', 'recipeLikes')
      .leftJoinAndSelect('recipes.tags', 'tags')
      .orderBy('recipes.createdAt', 'DESC');

    if (query) {
      // recipes.nameとingredients.nameに一致するqueryを取得する
      result.andWhere(
        'recipes.name LIKE :query OR ingredients.name Like :query',
        { query: `%${query}%` },
      );
    }

    // TODO: queryが一致しない場合、不一致のメッセージを返す

    try {
      const recipes = await result.getMany();
      return recipes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getRecipesById(id: number): Promise<Recipe | undefined> {
    const found = await this.createQueryBuilder('recipes')
      .leftJoinAndSelect('recipes.user', 'user')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipes.recipeLikes', 'recipeLikes')
      .leftJoinAndSelect('recipes.tags', 'tags')
      .where('recipes.id = :id', { id })
      .getOne();

    return found;
  }

  async createRecipe(
    createRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }

    const {
      name,
      time,
      remarks,
      image,
      ingredients,
      recipeDescriptions,
      tags,
    } = createRecipeDto;

    const recipe = this.create();

    const ingredientRepository = getCustomRepository(IngredientRepository);
    const recipeDescriptionRepository = getCustomRepository(
      RecipeDescriptionRepository,
    );
    const tagRepository = getCustomRepository(TagRepository);

    recipe.name = name;
    recipe.time = time;
    recipe.remarks = remarks;
    recipe.image = image;
    recipe.user = user;
    recipe.ingredients = ingredients;
    recipe.recipeDescriptions = recipeDescriptions;
    recipe.tags = tags;

    const newRecipe = await recipe.save();

    // 配列で渡されるingredientsのrecipeIdをingredientテーブルに渡すためmapを回す
    ingredients.map((ingredient) =>
      ingredientRepository.createIngredient({
        ...ingredient,
        recipe: newRecipe,
      }),
    );

    recipeDescriptions.map((recipeDescription) =>
      recipeDescriptionRepository.createRecipeDescription({
        ...recipeDescription,
        recipe: newRecipe,
      }),
    );

    tags.map((tag) => tagRepository.createTag({ ...tag, recipe: newRecipe }));

    delete recipe.user;

    return recipe;
  }
}
