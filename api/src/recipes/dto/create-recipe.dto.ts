import { Recipe } from '../recipe.model';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateRecipeDto {
  @IsNotEmpty({ message: 'レシピ名を入力してください' })
  name: string;

  @IsNotEmpty({ message: '調理時間を入力してください' })
  @IsInt({ message: '調理時間は数字で入力してください' })
  time: Recipe['time'];

  remarks: string;
  image: string;
}
