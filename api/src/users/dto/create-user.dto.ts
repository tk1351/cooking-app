import { IsNotEmpty, IsEmail } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: '名前を入力してください' })
  name: string;

  @IsEmail(
    {},
    { message: 'メールアドレスの形式(example@example.com)で入力してください' },
  )
  @IsNotEmpty({ message: 'メールアドレスを入力してください' })
  email: string;

  @IsNotEmpty({ message: 'パスワードを入力してください' })
  password: string;

  favoriteDish: string;
  specialDish: string;
  bio: string;
}
