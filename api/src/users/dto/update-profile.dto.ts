import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Social } from '../../socials/socials.entity';

export class UpdateProfileDto {
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

  @IsOptional()
  @IsNotEmpty({ message: '自己紹介を入力してください' })
  @IsString({ message: '自己紹介には文字を入力してください' })
  @MaxLength(400, { message: '自己紹介は400字以内で入力してください' })
  bio: string;

  @IsOptional()
  @IsNotEmpty({ message: 'SNSのURLを入力してください' })
  socials: Social[];
}
