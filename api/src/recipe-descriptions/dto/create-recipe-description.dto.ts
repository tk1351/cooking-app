import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { Recipe } from '../../recipes/recipes.entity';

export class CreateRecipeDescriptionDto {
  @IsNotEmpty({ message: '順番を入力してください' })
  @IsInt({ message: '順番は数字で入力してください' })
  order: number;

  @IsNotEmpty({ message: '作業工程の詳細を入力してください' })
  @IsString({ message: '作業工程の詳細は文字で入力してください' })
  text: string;

  @IsOptional()
  @IsUrl({}, { message: 'urlを入力してください' })
  url: string;

  @IsNotEmpty()
  recipe: Recipe;
}
