import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class AuthCredentialsDto {
  // @IsNotEmpty({ message: '名前を入力してください' })
  // @IsString({ message: '名前には文字を入力してください' })
  // @MinLength(4, { message: '名前は4文字以上入力してください' })
  // @MaxLength(15, { message: '名前は15文字以内で入力してください' })
  // name: string;

  @IsNotEmpty({ message: 'メールアドレスを入力してください' })
  @IsEmail(
    {},
    { message: 'メールアドレスの形式(example@example.com)で入力してください' },
  )
  email: string;

  @IsNotEmpty({ message: 'パスワードを入力してください' })
  @IsString({ message: 'パスワードには文字を入力してください' })
  @MinLength(6, { message: 'パスワードは6文字以上で入力してください' })
  @MaxLength(20, { message: 'パスワードは20文字以内で入力してください' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '半角英小文字、半角英大文字、数字を各1種類以上含んでください',
  })
  password: string;
}
