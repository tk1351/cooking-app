import { IsNotEmpty, IsString } from 'class-validator';
import { Recipe } from '../../recipes/recipe.entity';

export class CreateIngredientDto {
  @IsNotEmpty({ message: '材料を入力してください' })
  @IsString({ message: '材料は文字で入力してください' })
  name: string;

  @IsNotEmpty()
  recipe: Recipe;
}
