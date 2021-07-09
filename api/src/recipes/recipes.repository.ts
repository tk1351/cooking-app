import { EntityRepository, Repository, getCustomRepository } from 'typeorm';
import {
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Recipe } from './recipes.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import {
  GetRecipesFilterDto,
  GetRecipesByTagDto,
  GetRecipesByLimitNumberDto,
  GetRecipesByOffsetDto,
} from './dto/get-recipes.dto';
import { IngredientRepository } from '../ingredients/ingredients.repository';
import { RecipeDescriptionRepository } from '../recipe-descriptions/recipe-descriptions.repository';
import { TagRepository } from '../tags/tags.repository';
import { RecipeLikeRepository } from '../recipe-likes/recipe-likes.repository';
import { MyKnownMessage } from '../message.interface';
import { Ingredient } from '../ingredients/ingredients.entity';
import { RecipeDescription } from '../recipe-descriptions/recipe-descriptions.entity';
import { RecipeLike } from '../recipe-likes/recipe-likes.entity';
import { Tag } from '../tags/tags.entity';
import { UserInfo } from '../auth/type';
import { UserRepository } from '../users/users.repository';

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
        {
          query: `%${query}%`,
        },
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

  async getRecipseFilter(
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

  async getRecipesByLimitNumber(
    getRecipesByLimitNumberDto: GetRecipesByLimitNumberDto,
  ): Promise<Recipe[]> {
    const { limit } = getRecipesByLimitNumberDto;

    const result = this.createQueryBuilder('recipes')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipes.recipeLikes', 'recipeLikes')
      .leftJoinAndSelect('recipes.tags', 'tags')
      .orderBy('recipes.createdAt', 'DESC')
      .take(limit);

    try {
      const recipes = await result.getMany();
      return recipes;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getRecipesByOffset(
    getRecipesByOffsetDto: GetRecipesByOffsetDto,
  ): Promise<Recipe[]> {
    const { start, limit } = getRecipesByOffsetDto;

    const result = this.createQueryBuilder('recipes')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipes.recipeLikes', 'recipeLikes')
      .leftJoinAndSelect('recipes.tags', 'tags')
      .orderBy('recipes.createdAt', 'DESC')
      .skip(start)
      .take(limit);

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

  async getRecipesByTag(
    getRecipesByTag: GetRecipesByTagDto,
  ): Promise<Recipe[]> {
    const { name, start, limit } = getRecipesByTag;

    const result = await this.createQueryBuilder('recipes')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipes.recipeLikes', 'recipeLikes')
      .leftJoinAndSelect('recipes.tags', 'tags')
      .orderBy('recipes.createdAt', 'DESC');

    if (name && start && limit) {
      result
        .skip(start)
        .take(limit)
        .where(
          (qb) =>
            'recipes.id IN' +
            qb
              .subQuery()
              .select('tags.recipeId')
              .from('tags', 'tags')
              .where('tags.name = :name', { name })
              .getQuery(),
        );
    } else if (!start) {
      result
        .take(limit)
        .where(
          (qb) =>
            'recipes.id IN' +
            qb
              .subQuery()
              .select('tags.recipeId')
              .from('tags', 'tags')
              .where('tags.name = :name', { name })
              .getQuery(),
        );
    }

    try {
      const found = await result.getMany();

      return found;
    } catch (error) {
      throw new InternalServerErrorException();
    }
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
      ingredients,
      recipeDescriptions,
      tags,
    } = createRecipeDto;

    const recipe = this.create();

    recipe.name = name;
    recipe.time = time;
    recipe.remarks = remarks;
    recipe.image = image;
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

    const foundUser = await userRepository.getUserBySub(user.sub);

    if (foundUser.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }

    const ingredientRepository = getCustomRepository(IngredientRepository);
    const recipeDescriptionRepository = getCustomRepository(
      RecipeDescriptionRepository,
    );
    const recipeLikeRepository = getCustomRepository(RecipeLikeRepository);
    const tagRepository = getCustomRepository(TagRepository);

    // recipeIdが一致するingredientsを取得
    const ingredientsIndex: Ingredient[] =
      await ingredientRepository.getIngredientByRecipeId(id);

    // recipeIdが一致するrecipeDescriptionsを取得
    const recipeDescriptionsIndex: RecipeDescription[] =
      await recipeDescriptionRepository.getRecipeDescriptionsByRecipeId(id);

    // recipeIdが一致するrecipeLikesを取得
    const recipeLikesIndex: RecipeLike[] =
      await recipeLikeRepository.getRecipeLikesByRecipeId(id);

    const tagsIndex: Tag[] = await tagRepository.getTagsByRecipeId(id);

    // ingredientsIndexをmapして、IDが一致する材料を削除する
    ingredientsIndex.map((index) =>
      ingredientRepository.deleteIngredient(index.id),
    );

    // recipeDescriptionsIndexをmapして、IDが一致する作業工程を削除する
    recipeDescriptionsIndex.map((index) =>
      recipeDescriptionRepository.deleteRecipeDescription(index.id),
    );

    // recipeLikeIndexをmapして、idが一致するお気に入りを削除する
    recipeLikesIndex.map((index) =>
      recipeLikeRepository.deleteRecipeLikes(index.id),
    );

    tagsIndex.map((index) => tagRepository.deleteTag(index.id));

    const result = await this.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のrecipeは存在しません`);
    }

    return { message: 'レシピを削除しました' };
  }
}
