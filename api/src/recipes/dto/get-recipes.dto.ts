import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetRecipesFilterDto {
  @IsOptional()
  @IsNotEmpty({ message: 'queryを入力してください' })
  query: string;
}
