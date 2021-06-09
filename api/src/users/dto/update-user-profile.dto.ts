import {
  IsOptional,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsNotEmpty({ message: '名前を入力してください' })
  @IsString({ message: '名前には文字を入力してください' })
  @MinLength(4, { message: '名前は4字以上入力してください' })
  @MaxLength(20, { message: '名前は20字以内で入力してください' })
  name: string;

  @IsOptional()
  @IsString()
  favoriteDish: string;

  @IsOptional()
  @IsString()
  specialDish: string;
}
