import { IsNotEmpty } from 'class-validator';

export class GetUsersByLimitNumberDto {
  @IsNotEmpty({ message: '数字を入力してください' })
  limit: number;
}

export class GetUsersByOffsetDto {
  @IsNotEmpty({ message: '開始する数字を入力してください' })
  start: number;

  @IsNotEmpty({ message: '取得数を入力してください' })
  limit: number;
}
