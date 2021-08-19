import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetRecipesFilterDto {
  @IsOptional()
  @IsNotEmpty({ message: 'queryを入力してください' })
  query: string;

  @IsOptional()
  @IsNotEmpty({ message: 'tagを入力してください' })
  tag: string;

  @IsOptional()
  @IsNotEmpty({ message: '開始する数字を入力してください' })
  start: number;

  @IsOptional()
  @IsNotEmpty({ message: '取得数を入力してください' })
  limit: number;
}
