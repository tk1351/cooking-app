import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetRecipesFilterDto {
  @IsOptional()
  @IsNotEmpty({ message: 'queryを入力してください' })
  query: string;
}

export class GetRecipesByTagDto {
  @IsNotEmpty({ message: 'tagを入力してください' })
  name: string;
}

export class GetRecipesByLimitNumberDto {
  @IsNotEmpty({ message: '数字を入力してください' })
  limit: number;
}
