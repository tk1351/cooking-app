import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeRepository } from './recipes.repository';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipes.entity';
import {
  GetRecipesFilterDto,
  GetRecipesByTagDto,
  GetRecipesByLimitNumberDto,
  GetRecipesByOffsetDto,
} from './dto/get-recipes.dto';
import { MyKnownMessage } from '../message.interface';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeLikesService } from '../recipe-likes/recipe-likes.service';
import { RecipeLike } from '../recipe-likes/recipe-likes.entity';
import { TagsService } from '../tags/tags.service';
import { RecipeDescriptionsService } from '../recipe-descriptions/recipe-descriptions.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { UserInfo } from '../auth/type';
import { UsersService } from '../users/users.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeRepository)
    private recipeRepository: RecipeRepository,
    private recipeLikesService: RecipeLikesService,
    private ingredientsService: IngredientsService,
    private recipeDescriptionsService: RecipeDescriptionsService,
    private tagsService: TagsService,
    private usersService: UsersService,
  ) {}

  async getRecipes(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipes(getRecipesFilterDto);
  }

  async getRecipesFilter(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipesFilter(getRecipesFilterDto);
  }

  async getRecipesByLimitNumber(
    getRecipesByLimitNumberDto: GetRecipesByLimitNumberDto,
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipesByLimitNumber(
      getRecipesByLimitNumberDto,
    );
  }

  async getRecipesByOffset(
    getRecipesByOffsetDto: GetRecipesByOffsetDto,
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipesByOffset(getRecipesByOffsetDto);
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
    user: UserInfo,
  ): Promise<Recipe> {
    return this.recipeRepository.createRecipe(createRecipeDto, user);
  }

  async likeRecipe(recipeId: number, user: UserInfo): Promise<MyKnownMessage> {
    // recipeIdからお気に入りをするrecipeを特定する
    // recipeがない場合はnotfound
    const foundRecipe = await this.getRecipeById(recipeId);

    const foundUser = await this.usersService.getUserBySub(user.sub);

    // recipeがこのユーザーにお気に入りされているか確認
    const usersLike: RecipeLike[] = foundRecipe.recipeLikes.filter(
      (like) => like.userId === foundUser.id,
    );
    // お気に入りされていたらメッセージを返す
    if (usersLike.length > 0) {
      return { message: '既にお気に入り登録されています' };
    }
    // お気に入りが無いとrecipeのrecipeLikesにuidとrecipeIdのオブジェクトを挿入
    // お気に入りをしたら メッセージを出す
    await this.recipeLikesService.recipeLike({
      recipeId,
      userId: foundUser.id,
    });

    return { message: 'お気に入りに登録しました' };
  }

  async updateRecipe(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
    user: UserInfo,
  ): Promise<Recipe> {
    const foundUser = await this.usersService.getUserBySub(user.sub);
    if (foundUser.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }
    // 更新対象の記事を特定する
    const foundRecipe = await this.getRecipeById(id);
    if (!foundRecipe)
      throw new NotFoundException(`ID: ${id}のrecipeは存在しません`);

    // 材料と作業工程の更新があるか確認する
    const {
      name,
      time,
      remarks,
      image,
      url,
      ingredients,
      recipeDescriptions,
      tags,
    } = updateRecipeDto;

    // recipe部分の更新をする
    foundRecipe.name = name;
    foundRecipe.time = time;
    foundRecipe.remarks = remarks;
    foundRecipe.image = image;
    foundRecipe.url = url;

    await this.ingredientsService.deleteIngredientsByRecipeId(id);

    const createIngredientDtos = ingredients.map((ingredient) => {
      return { ...ingredient, recipe: foundRecipe };
    });

    const newIngredients = await this.ingredientsService.createIngredients(
      createIngredientDtos,
    );

    foundRecipe.ingredients = newIngredients;

    await this.recipeDescriptionsService.deleteRecipeDescriptionsByRecipeId(id);

    const createRecipeDescriptionsDtos = recipeDescriptions.map(
      (recipeDescription) => {
        return { ...recipeDescription, recipe: foundRecipe };
      },
    );

    const newRecipeDescriptions =
      await this.recipeDescriptionsService.createRecipeDescriptions(
        createRecipeDescriptionsDtos,
      );

    foundRecipe.recipeDescriptions = newRecipeDescriptions;

    await this.tagsService.deleteTagsByRecipeId(id);

    const createTagDtos = tags.map((tag) => {
      return { ...tag, recipe: foundRecipe };
    });

    const newTags = await this.tagsService.createTags(createTagDtos);

    foundRecipe.tags = newTags;

    // 更新後のrecipeを返す
    const newRecipe = await this.recipeRepository.save(foundRecipe);
    return newRecipe;
  }

  async deleteRecipe(id: number, user: UserInfo): Promise<MyKnownMessage> {
    return await this.recipeRepository.deleteRecipe(id, user);
  }

  async unlikeRecipe(
    recipeId: number,
    user: UserInfo,
  ): Promise<MyKnownMessage> {
    // recipeIdからお気に入りを解除するrecipeを特定する
    // recipeがない場合はnot found
    const foundRecipe = await this.getRecipeById(recipeId);

    const foundUser = await this.usersService.getUserBySub(user.sub);

    // recipeがこのユーザーにお気に入りされているか確認
    const usersLike: RecipeLike[] = foundRecipe.recipeLikes.filter(
      (like) => like.userId === foundUser.id,
    );
    // お気に入りしていなかったらメッセージを返す
    if (usersLike.length === 0) {
      return { message: 'お気に入りがありません' };
    }
    // 該当するrecipeIdのuserIdが一致するお気に入りを削除する
    await this.recipeLikesService.unlikeRecipe({
      userId: foundUser.id,
      recipeId,
    });

    // お気に入りを削除したらメッセージを返す
    return { message: 'お気に入りを解除しました' };
  }
}
