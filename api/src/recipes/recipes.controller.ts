import { Controller, Get, Post, Body } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.model';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  getAllRecipes(): Recipe[] {
    return this.recipesService.getAllRecipes();
  }

  @Post()
  createRecipe(@Body() createRecipeDto: CreateRecipeDto): Recipe {
    return this.recipesService.createRecipe(createRecipeDto);
  }
}
