import { Injectable, NotFoundException } from '@nestjs/common';
import { Recipe } from './recipe.model';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { GetRecipesFilterDto } from './dto/get-recipes.dto';

@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];

  getAllRecipes(): Recipe[] {
    return this.recipes;
  }

  getRecipeById(id: number): Recipe {
    const found = this.recipes.find((recipe) => recipe.id == id);

    if (!found) {
      throw new NotFoundException(`ID: ${id}のrecipeは存在しません`);
    }
    return found;
  }

  getRecipesWithFilters(getRecipesFilterDto: GetRecipesFilterDto): Recipe[] {
    const { query } = getRecipesFilterDto;
    const recipes = this.getAllRecipes();
    if (query) {
      return recipes.filter((recipe) => recipe.name.includes(query));
    }

    return recipes;
  }

  createRecipe(createRecipeDto: CreateRecipeDto): Recipe {
    const randomId = Math.floor(Math.random() * 101);

    const { name, time, remarks, image } = createRecipeDto;
    const recipe: Recipe = {
      id: randomId,
      name,
      time,
      remarks,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.recipes.push(recipe);
    return recipe;
  }

  updateRecipe(id: number, createRecipeDto: CreateRecipeDto): Recipe {
    const recipe = this.getRecipeById(id);
    const { name, time, remarks, image } = createRecipeDto;

    recipe.name = name;
    recipe.time = time;
    recipe.remarks = remarks;
    recipe.image = image;

    return recipe;
  }

  deleteRecipe(id: number): void {
    const found = this.getRecipeById(id);
    this.recipes = this.recipes.filter((recipe) => recipe.id != found.id);
  }
}
