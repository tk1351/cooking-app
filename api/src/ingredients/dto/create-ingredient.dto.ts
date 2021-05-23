import { IsNotEmpty, IsString } from 'class-validator';
import { Recipe } from '../../recipes/recipes.entity';

export class CreateIngredientDto {
  @IsNotEmpty({ message: '材料を入力してください' })
  @IsString({ message: '材料は文字で入力してください' })
  name: string;

  @IsNotEmpty({ message: '量を入力してください' })
  @IsString({ message: '量を文字で入力してください' })
  amount: string;

  @IsNotEmpty()
  recipe: Recipe;
}
