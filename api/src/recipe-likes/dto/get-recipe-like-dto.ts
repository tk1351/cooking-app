import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetRecipeLikeDto {
  @IsOptional()
  @IsNotEmpty({ message: '開始する数字を入力してください' })
  start: number;

  @IsOptional()
  @IsNotEmpty({ message: '取得数を入力してください' })
  limit: number;
}
