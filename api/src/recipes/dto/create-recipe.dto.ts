import { IsNotEmpty, IsInt, IsIn } from 'class-validator';
import { Recipe } from '../recipe.entity';
import { Ingredient } from '../../ingredients/ingredient.entity';
import { RecipeDescription } from '../../recipe-descriptions/recipe-description.entity';

export class CreateRecipeDto {
  @IsNotEmpty({ message: 'レシピ名を入力してください' })
  name: string;

  @IsNotEmpty({ message: '調理時間を入力してください' })
  @IsInt({ message: '調理時間は数字で入力してください' })
  @IsIn([5, 10, 15, 20, 30, 40, 50, 60], {
    message: '調理時間は5, 10, 15, 20, 30, 40, 50, 60の内から選択してください',
  })
  time: Recipe['time'];

  remarks: string;
  image: string;

  @IsNotEmpty({ message: '材料を入力してください' })
  ingredients: Ingredient[];

  @IsNotEmpty({ message: '作業工程の詳細を入力してください' })
  recipeDescriptions: RecipeDescription[];
}
