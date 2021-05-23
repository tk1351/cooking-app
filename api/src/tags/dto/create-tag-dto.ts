import { IsNotEmpty, IsString } from 'class-validator';
import { Recipe } from '../../recipes/recipes.entity';

export class CreateTagDto {
  @IsNotEmpty({ message: 'タグ名を入力してください' })
  @IsString({ message: 'タグ名は文字で入力してください' })
  name: string;

  @IsNotEmpty()
  recipe: Recipe;
}
