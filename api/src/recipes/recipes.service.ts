import { Injectable } from '@nestjs/common';
import { Recipe } from './recipe.model';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];

  getAllRecipes(): Recipe[] {
    return this.recipes;
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
}
