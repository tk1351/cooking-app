import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeRepository } from './recipes.repository';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipes.entity';
import { GetRecipesFilterDto, GetRecipesByTagDto } from './dto/get-recipes.dto';
import { MyKnownMessage } from '../message.interface';
import { User } from '../users/users.entity';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeLikesService } from '../recipe-likes/recipe-likes.service';
import { RecipeLike } from '../recipe-likes/recipe-likes.entity';
import { TagsService } from '../tags/tags.service';
import { RecipeDescriptionsService } from '../recipe-descriptions/recipe-descriptions.service';
import { IngredientsService } from '../ingredients/ingredients.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeRepository)
    private recipeRepository: RecipeRepository,
    private recipeLikesService: RecipeLikesService,
    private ingredientsService: IngredientsService,
    private recipeDescriptionsService: RecipeDescriptionsService,
    private tagsService: TagsService,
  ) {}

  async getRecipes(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipes(getRecipesFilterDto);
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
    const found = await this.recipeRepository.getRecipeById(id);

    return found;
  }

  async getRecipesByTag(
    getRecipesByTag: GetRecipesByTagDto,
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipesByTag(getRecipesByTag);
  }

  async createRecipe(
    createRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    return this.recipeRepository.createRecipe(createRecipeDto, user);
  }

  async likeRecipe(recipeId: number, user: User): Promise<MyKnownMessage> {
    // recipeIdからお気に入りをするrecipeを特定する
    // recipeがない場合はnotfound
    const found: Recipe = await this.getRecipeById(recipeId);

    // recipeがこのユーザーにお気に入りされているか確認
    const usersLike: RecipeLike[] = found.recipeLikes.filter(
      (like) => like.userId === user.id,
    );
    // お気に入りされていたらメッセージを返す
    if (usersLike.length > 0) {
      return { message: '既にお気に入り登録されています' };
    }
    // お気に入りが無いとrecipeのrecipeLikesにuidとrecipeIdのオブジェクトを挿入
    // お気に入りをしたら メッセージを出す
    await this.recipeLikesService.recipeLike({
      recipeId,
      userId: user.id,
    });

    return { message: 'お気に入りに登録しました' };
  }

  async updateRecipe(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }
    // 更新対象の記事を特定する
    const found = await this.getRecipeById(id);
    if (!found) throw new NotFoundException(`ID: ${id}のrecipeは存在しません`);

    // 材料と作業工程の更新があるか確認する
    const {
      name,
      time,
      remarks,
      image,
      ingredients,
      recipeDescriptions,
      tags,
    } = updateRecipeDto;

    // recipe部分の更新をする
    found.name = name;
    found.time = time;
    found.remarks = remarks;
    found.image = image;

    await this.ingredientsService.deleteIngredientsByRecipeId(id);

    const createIngredientDtos = ingredients.map((ingredient) => {
      return { ...ingredient, recipe: found };
    });

    const newIngredients = await this.ingredientsService.createIngredients(
      createIngredientDtos,
    );

    found.ingredients = newIngredients;

    await this.recipeDescriptionsService.deleteRecipeDescriptionsByRecipeId(id);

    const createRecipeDescriptionsDtos = recipeDescriptions.map(
      (recipeDescription) => {
        return { ...recipeDescription, recipe: found };
      },
    );

    const newRecipeDescriptions =
      await this.recipeDescriptionsService.createRecipeDescriptions(
        createRecipeDescriptionsDtos,
      );

    found.recipeDescriptions = newRecipeDescriptions;

    await this.tagsService.deleteTagsByRecipeId(id);

    const createTagDtos = tags.map((tag) => {
      return { ...tag, recipe: found };
    });

    const newTags = await this.tagsService.createTags(createTagDtos);

    found.tags = newTags;

    // 更新後のrecipeを返す
    const newRecipe = await this.recipeRepository.save(found);
    return newRecipe;
  }

  async deleteRecipe(id: number, user: User): Promise<MyKnownMessage> {
    return await this.recipeRepository.deleteRecipe(id, user);
  }

  async unlikeRecipe(recipeId: number, user: User): Promise<MyKnownMessage> {
    // recipeIdからお気に入りを解除するrecipeを特定する
    // recipeがない場合はnot found
    const found: Recipe = await this.getRecipeById(recipeId);

    // recipeがこのユーザーにお気に入りされているか確認
    const usersLike: RecipeLike[] = found.recipeLikes.filter(
      (like) => like.userId === user.id,
    );
    // お気に入りしていなかったらメッセージを返す
    if (usersLike.length === 0) {
      return { message: 'お気に入りがありません' };
    }
    // 該当するrecipeIdのuserIdが一致するお気に入りを削除する
    await this.recipeLikesService.unlikeRecipe({
      userId: user.id,
      recipeId,
    });

    // お気に入りを削除したらメッセージを返す
    return { message: 'お気に入りを解除しました' };
  }
}
