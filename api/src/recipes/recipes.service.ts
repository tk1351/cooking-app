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
    // recipeId??????????????????????????????recipe???????????????
    // recipe??????????????????notfound
    const foundRecipe = await this.getRecipeById(recipeId);

    const foundUser = await this.usersService.getUserBySub(user.sub);

    // recipe???????????????????????????????????????????????????????????????
    const usersLike: RecipeLike[] = foundRecipe.recipeLikes.filter(
      (like) => like.userId === foundUser.id,
    );
    // ?????????????????????????????????????????????????????????
    if (usersLike.length > 0) {
      return { message: '?????????????????????????????????????????????' };
    }
    // ???????????????????????????recipe???recipeLikes???uid???recipeId??????????????????????????????
    // ??????????????????????????? ????????????????????????
    await this.recipeLikesService.recipeLike({
      recipeId,
      userId: foundUser.id,
    });

    return { message: '????????????????????????????????????' };
  }

  async updateRecipe(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
    user: UserInfo,
  ): Promise<Recipe> {
    const foundUser = await this.usersService.getUserBySub(user.sub);
    if (foundUser.role !== 'admin') {
      throw new UnauthorizedException('????????????????????????');
    }
    // ????????????????????????????????????
    const foundRecipe = await this.getRecipeById(id);
    if (!foundRecipe)
      throw new NotFoundException(`ID: ${id}???recipe?????????????????????`);

    // ??????????????????????????????????????????????????????
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

    // recipe????????????????????????
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

    // ????????????recipe?????????
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
    // recipeId????????????????????????????????????recipe???????????????
    // recipe??????????????????not found
    const foundRecipe = await this.getRecipeById(recipeId);

    const foundUser = await this.usersService.getUserBySub(user.sub);

    // recipe???????????????????????????????????????????????????????????????
    const usersLike: RecipeLike[] = foundRecipe.recipeLikes.filter(
      (like) => like.userId === foundUser.id,
    );
    // ???????????????????????????????????????????????????????????????
    if (usersLike.length === 0) {
      return { message: '?????????????????????????????????' };
    }
    // ????????????recipeId???userId?????????????????????????????????????????????
    await this.recipeLikesService.unlikeRecipe({
      userId: foundUser.id,
      recipeId,
    });

    // ?????????????????????????????????????????????????????????
    return { message: '????????????????????????????????????' };
  }
}
