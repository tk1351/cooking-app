import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateIngredientDto {
  @IsOptional()
  @IsNotEmpty({ message: '材料を入力してください' })
  @IsString({ message: '材料は文字で入力してください' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: '量を入力してください' })
  @IsString({ message: '量を文字で入力してください' })
  amount: string;
}
