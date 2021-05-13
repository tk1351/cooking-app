import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty({ message: 'メールアドレスを入力してください' })
  @IsEmail(
    {},
    { message: 'メールアドレスの形式(example@example.com)で入力してください' },
  )
  email: string;

  @IsNotEmpty({ message: 'パスワードを入力してください' })
  @IsString({ message: 'パスワードには文字を入力してください' })
  @MinLength(6, { message: 'パスワードは6字以上で入力してください' })
  @MaxLength(20, { message: 'パスワードは20字以内で入力してください' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '半角英小文字、半角英大文字、数字を各1種類以上含んでください',
  })
  password: string;
}
