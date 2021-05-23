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
import { IngredientsService } from '../ingredients/ingredients.service';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Ingredient } from '../ingredients/ingredients.entity';
import { RecipeDescriptionsService } from '../recipe-descriptions/recipe-descriptions.service';
import { RecipeDescription } from '../recipe-descriptions/recipe-descriptions.entity';
import { RecipeLikesService } from '../recipe-likes/recipe-likes.service';
import { RecipeLike } from '../recipe-likes/recipe-like.entity';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeRepository)
    private recipeRepository: RecipeRepository,
    private ingredientsService: IngredientsService,
    private recipeDescriptionsService: RecipeDescriptionsService,
    private recipeLikesService: RecipeLikesService,
    private tagsService: TagsService,
  ) {}

  async getRecipes(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipes(getRecipesFilterDto);
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
    const found = await this.recipeRepository.getRecipesById(id);

    return found;
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
    if (user.role !== 'admin') {
      throw new UnauthorizedException('権限がありません');
    }
    // recipeIdが一致するingredientsを取得
    const ingredientsIndex: Ingredient[] =
      await this.ingredientsService.getIngredientByRecipeId(id);

    // recipeIdが一致するrecipeDescriptionsを取得
    const recipeDescriptionsIndex: RecipeDescription[] =
      await this.recipeDescriptionsService.getRecipeDescriptionsByRecipeId(id);

    // recipeIdが一致するrecipeLikesを取得
    const recipeLikesIndex: RecipeLike[] =
      await this.recipeLikesService.getRecipeLikesByRecipeId(id);

    // ingredientsIndexをmapして、IDが一致する材料を削除する
    ingredientsIndex.map((index) =>
      this.ingredientsService.deleteIngredient(index.id),
    );

    // recipeDescriptionsIndexをmapして、IDが一致する作業工程を削除する
    recipeDescriptionsIndex.map((index) =>
      this.recipeDescriptionsService.deleteRecipeDescription(index.id),
    );

    // recipeLikeIndexをmapして、idが一致するお気に入りを削除する
    recipeLikesIndex.map((index) =>
      this.recipeLikesService.deleteRecipeLikes(index.id),
    );

    const result = await this.recipeRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のrecipeは存在しません`);
    }

    return { message: 'レシピを削除しました' };
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
