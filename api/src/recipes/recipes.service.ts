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
import { Ingredient } from '../ingredients/ingredient.entity';
import { RecipeDescriptionsService } from '../recipe-descriptions/recipe-descriptions.service';
import { RecipeDescription } from 'src/recipe-descriptions/recipe-description.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeRepository)
    private recipeRepository: RecipeRepository,
    private ingredientsService: IngredientsService,
    private recipeDescriptionsService: RecipeDescriptionsService,
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

    // ingredientsIndexをmapして、deleteIngredientで削除する
    ingredientsIndex.map((index) =>
      this.ingredientsService.deleteIngredient(index.id),
    );

    // recipeDescriptionsIndexをmapして、deleteRecipeDescriptionで削除する
    recipeDescriptionsIndex.map((index) =>
      this.recipeDescriptionsService.deleteRecipeDescription(index.id),
    );

    const result = await this.recipeRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のrecipeは存在しません`);
    }

    return { message: 'レシピを削除しました' };
  }
}
