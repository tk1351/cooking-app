import { IsOptional, IsNotEmpty, IsInt, IsUrl } from 'class-validator';

export class UpdateSocialsDto {
  @IsOptional()
  @IsNotEmpty({ message: 'カテゴリーを入力してください' })
  @IsInt({ message: 'カテゴリーを数字で入力してください' })
  category: number;

  @IsNotEmpty({ message: 'URLを入力してください' })
  @IsUrl({}, { message: 'URLは https:// から正しく入力してください' })
  url: string;
}
