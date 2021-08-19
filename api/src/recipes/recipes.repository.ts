import { EntityRepository, Repository, getCustomRepository } from 'typeorm';
import {
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Recipe } from './recipes.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { GetRecipesFilterDto } from './dto/get-recipes.dto';
import { IngredientRepository } from '../ingredients/ingredients.repository';
import { RecipeDescriptionRepository } from '../recipe-descriptions/recipe-descriptions.repository';
import { TagRepository } from '../tags/tags.repository';
import { MyKnownMessage } from '../message.interface';
import { UserInfo } from '../auth/type';
import { UserRepository } from '../users/users.repository';

@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe> {
  async getRecipes(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<[Recipe[], number]> {
    const { query, tag, start, limit } = getRecipesFilterDto;

    const result = this.createQueryBuilder('recipes')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipes.recipeLikes', 'recipeLikes')
      .leftJoinAndSelect('recipes.tags', 'tags')
      .where(
        query
          ? 'recipes.name LIKE :query OR ingredients.name LIKE :query'
          : 'true',
        {
          query: `%${query}%`,
        },
      )
      .andWhere(
        tag
          ? (qb) =>
              'recipes.id IN' +
              qb
                .subQuery()
                .select('tags.recipeId')
                .from('tags', 'tags')
                .where('tags.name = :tag', { tag })
                .getQuery()
          : 'true',
      )
      .take(limit)
      .skip(start)
      .orderBy('recipes.id', 'DESC')
      .getManyAndCount();

    // TODO: queryが一致しない場合、不一致のメッセージを返す

    try {
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getRecipesFilter(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    const { query, limit, start } = getRecipesFilterDto;

    const result = this.createQueryBuilder('recipes')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipes.recipeLikes', 'recipeLikes')
      .leftJoinAndSelect('recipes.tags', 'tags')
      .orderBy('recipes.createdAt', 'DESC');

    if (query && limit && start) {
      result
        .skip(start)
        .take(limit)
        .andWhere('recipes.name LIKE :query OR ingredients.name Like :query', {
          query: `%${query}%`,
        });
    } else if (!start) {
      result
        .take(limit)
        .andWhere('recipes.name LIKE :query OR ingredients.name Like :query', {
          query: `%${query}%`,
        });
    }

    try {
      const recipes = await result.getMany();
      return recipes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
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
    user: UserInfo,
  ): Promise<Recipe> {
    const userRepository = getCustomRepository(UserRepository);

    const foundUser = await userRepository.getUserBySub(user.sub);

    if (foundUser.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }

    const ingredientRepository = getCustomRepository(IngredientRepository);
    const recipeDescriptionRepository = getCustomRepository(
      RecipeDescriptionRepository,
    );
    const tagRepository = getCustomRepository(TagRepository);

    const {
      name,
      time,
      remarks,
      image,
      url,
      ingredients,
      recipeDescriptions,
      tags,
    } = createRecipeDto;

    const recipe = this.create();

    recipe.name = name;
    recipe.time = time;
    recipe.remarks = remarks;
    recipe.image = image;
    recipe.url = url;
    recipe.user = foundUser;
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

  async deleteRecipe(id: number, user: UserInfo): Promise<MyKnownMessage> {
    const userRepository = getCustomRepository(UserRepository);

    const recipe = await this.getRecipeById(id);
    const foundUser = await userRepository.getUserBySub(user.sub);

    if (foundUser.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }

    recipe.ingredients = [];
    recipe.recipeDescriptions = [];
    recipe.tags = [];
    recipe.recipeLikes = [];

    await this.save(recipe);

    const result = await this.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のrecipeは存在しません`);
    }

    return { message: 'レシピを削除しました' };
  }
}
