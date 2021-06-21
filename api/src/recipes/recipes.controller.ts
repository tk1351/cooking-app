import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Query,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipes.entity';
import {
  GetRecipesFilterDto,
  GetRecipesByTagDto,
  GetRecipesByLimitNumberDto,
  GetRecipesByOffsetDto,
} from './dto/get-recipes.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { MyKnownMessage } from '../message.interface';
import { GetUser } from '../users/get-user.decorator';
import { User } from '../users/users.entity';
import { CreateRecipeValidationPipe } from './pipes/create-recipe-validation.pipe';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  getRecipes(
    @Query(ValidationPipe) getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    return this.recipesService.getRecipes(getRecipesFilterDto);
  }

  @Get('/filter')
  async getRecipseFilter(
    @Query(ValidationPipe) getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    return this.recipesService.getRecipseFilter(getRecipesFilterDto);
  }

  @Get('/number')
  getRecipesByLimitNumber(
    @Query(ValidationPipe)
    getRecipesByLimitNumberDto: GetRecipesByLimitNumberDto,
  ): Promise<Recipe[]> {
    return this.recipesService.getRecipesByLimitNumber(
      getRecipesByLimitNumberDto,
    );
  }

  @Get('/offset')
  getRecipesByOffset(
    @Query(ValidationPipe) getRecipesByOffsetDto: GetRecipesByOffsetDto,
  ): Promise<Recipe[]> {
    return this.recipesService.getRecipesByOffset(getRecipesByOffsetDto);
  }

  @Get('/tag')
  getRecipesByTag(
    @Query(ValidationPipe) getRecipesByTag: GetRecipesByTagDto,
  ): Promise<Recipe[]> {
    return this.recipesService.getRecipesByTag(getRecipesByTag);
  }

  @Get('/:id')
  getRecipeById(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.getRecipeById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  createRecipe(
    @Body(CreateRecipeValidationPipe, ValidationPipe)
    createRecipeDto: CreateRecipeDto,
    @GetUser() user: User,
  ): Promise<Recipe> {
    return this.recipesService.createRecipe(createRecipeDto, user);
  }

  @Post('/:recipeId/like')
  @UseGuards(AuthGuard())
  likeRecipe(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @GetUser() user: User,
  ): Promise<MyKnownMessage> {
    return this.recipesService.likeRecipe(recipeId, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  updateRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateRecipeDto: UpdateRecipeDto,
    @GetUser() user: User,
  ): Promise<Recipe> {
    return this.recipesService.updateRecipe(id, updateRecipeDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteRecipe(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<MyKnownMessage> {
    return this.recipesService.deleteRecipe(id, user);
  }

  @Delete('/:recipeId/unlike')
  @UseGuards(AuthGuard())
  unlikeRecipe(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @GetUser() user: User,
  ): Promise<MyKnownMessage> {
    return this.recipesService.unlikeRecipe(recipeId, user);
  }
}
