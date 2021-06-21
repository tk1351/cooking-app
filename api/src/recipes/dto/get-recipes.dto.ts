import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetRecipesFilterDto {
  @IsOptional()
  @IsNotEmpty({ message: 'queryを入力してください' })
  query: string;

  @IsOptional()
  @IsNotEmpty({ message: '開始する数字を入力してください' })
  start: number;

  @IsOptional()
  @IsNotEmpty({ message: '取得数を入力してください' })
  limit: number;
}

export class GetRecipesByTagDto {
  @IsNotEmpty({ message: 'tagを入力してください' })
  name: string;
}

export class GetRecipesByLimitNumberDto {
  @IsNotEmpty({ message: '数字を入力してください' })
  limit: number;
}

export class GetRecipesByOffsetDto {
  @IsNotEmpty({ message: '開始する数字を入力してください' })
  start: number;

  @IsNotEmpty({ message: '取得数を入力してください' })
  limit: number;
}
