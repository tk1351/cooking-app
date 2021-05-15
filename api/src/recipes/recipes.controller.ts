import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.model';
import { GetRecipesFilterDto } from './dto/get-recipes.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  getRecipes(@Query() getRecipesFilterDto: GetRecipesFilterDto): Recipe[] {
    if (Object.keys(getRecipesFilterDto).length) {
      return this.recipesService.getRecipesWithFilters(getRecipesFilterDto);
    } else {
      return this.recipesService.getAllRecipes();
    }
  }

  @Get('/:id')
  getRecipeById(@Param('id') id: number): Recipe {
    return this.recipesService.getRecipeById(id);
  }

  @Post()
  createRecipe(@Body() createRecipeDto: CreateRecipeDto): Recipe {
    return this.recipesService.createRecipe(createRecipeDto);
  }

  @Patch('/:id')
  updateRecipe(
    @Param('id') id: number,
    @Body() createRecipeDto: CreateRecipeDto,
  ): Recipe {
    return this.recipesService.updateRecipe(id, createRecipeDto);
  }

  @Delete('/:id')
  deleteRecipe(@Param('id') id: number): void {
    return this.recipesService.deleteRecipe(id);
  }
}
