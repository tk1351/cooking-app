import { Recipe } from '../recipe.model';

export class CreateRecipeDto {
  name: string;
  time: Recipe['time'];
  remarks: string;
  image: string;
}
