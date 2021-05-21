import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
  Inject,
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
import { Ingredient } from '../ingredients/ingredient.entity';
import { RecipeDescriptionsService } from '../recipe-descriptions/recipe-descriptions.service';
import { RecipeDescription } from '../recipe-descriptions/recipe-description.entity';
import { RecipeLikesService } from '../recipe-likes/recipe-likes.service';
import { RecipeLike } from '../recipe-likes/recipe-like.entity';
import { RecipeLikeRepository } from 'src/recipe-likes/recipe-like.repository';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeRepository)
    private recipeRepository: RecipeRepository,
    private ingredientsService: IngredientsService,
    private recipeDescriptionsService: RecipeDescriptionsService,
    // @Inject(forwardRef(() => RecipeLikesService))
    private recipeLikesService: RecipeLikesService,
  ) {}

  async getRecipes(
    getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipes(getRecipesFilterDto);
  }

  async getRecipeById(id: number): Promise<Recipe> {
    const found = await this.recipeRepository
      .createQueryBuilder('recipes')
      .leftJoinAndSelect('recipes.ingredients', 'ingredients')
      .leftJoinAndSelect('recipes.recipeDescriptions', 'recipeDescriptions')
      .leftJoinAndSelect('recipes.recipeLikes', 'recipeLikes')
      .where('recipes.id = :id', { id })
      .getOne();

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
    await this.recipeLikesService.postLike({
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

    // 材料と作業工程の更新があるか確認する
    const { name, time, remarks, image, ingredients, recipeDescriptions } =
      updateRecipeDto;

    if (ingredients) {
      // 材料部分の更新をする
      await ingredients.map((ingredient) => {
        const { id, name, amount } = ingredient;
        this.ingredientsService.updateIngredient(id, {
          name,
          amount,
        });
      });
    }

    if (recipeDescriptions) {
      // 作業工程部分の更新をする
      await recipeDescriptions.map((recipeDescription) => {
        const { id, order, text } = recipeDescription;
        this.recipeDescriptionsService.updateRecipeDescription(id, {
          order,
          text,
        });
      });
    }

    // recipeIdの一致する、更新後の材料を取得する
    const newIngredients =
      await this.ingredientsService.getIngredientByRecipeId(id);

    // recipeIdの一致する、更新後の作業工程を取得する
    const newRecipeDescriptions =
      await this.recipeDescriptionsService.getRecipeDescriptionsByRecipeId(id);

    // recipeの更新があるか確認する

    // recipe部分の更新をする
    found.name = name;
    found.time = time;
    found.remarks = remarks;
    found.image = image;
    found.ingredients = newIngredients;
    found.recipeDescriptions = newRecipeDescriptions;

    const newRecipe = await found.save();

    // 更新後のrecipeを返す
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
