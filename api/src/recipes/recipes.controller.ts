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
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.model';
import { GetRecipesFilterDto } from './dto/get-recipes.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { MyKnownMessage } from '../message.interface';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  getRecipes(
    @Query(ValidationPipe) getRecipesFilterDto: GetRecipesFilterDto,
  ): Promise<Recipe[]> {
    return this.recipesService.getRecipes(getRecipesFilterDto);
  }

  @Get('/:id')
  getRecipeById(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.getRecipeById(id);
  }

  @Post()
  createRecipe(
    @Body(ValidationPipe) createRecipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.createRecipe(createRecipeDto);
  }

  @Patch('/:id')
  updateRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createRecipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.updateRecipe(id, createRecipeDto);
  }

  @Delete('/:id')
  deleteRecipe(@Param('id', ParseIntPipe) id: number): Promise<MyKnownMessage> {
    return this.recipesService.deleteRecipe(id);
  }
}
