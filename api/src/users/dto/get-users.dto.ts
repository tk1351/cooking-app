import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsNotEmpty({ message: '開始する数字を入力してください' })
  start: number;

  @IsNotEmpty({ message: '取得数を入力してください' })
  @IsOptional()
  limit: number;
}
