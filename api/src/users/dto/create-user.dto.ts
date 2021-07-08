import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'ユーザー名を入力してください' })
  @IsString({ message: 'ユーザー名は文字で入力してください' })
  name: string;

  @IsNotEmpty({ message: 'メールアドレスを入力してください' })
  @IsEmail(
    {},
    { message: 'メールアドレスの形式(example@example.com)で入力してください' },
  )
  email: string;

  @IsNotEmpty({ message: 'subを入力してください' })
  @IsString({ message: 'subには文字を入力してください' })
  sub: string;
}
