import * as yup from 'yup'

const requireEmail = 'メールアドレスを入力してください'
const violationEmail = '正しい形式で入力してください'
const requirePassword = 'パスワードを入力してください'
const violationPasswordMin = 'パスワードは6文字以上で入力してください'
const violationPasswordMax = 'パスワードは20文字以内で入力してください'
const violationPasswordRegExp =
  '半角英小文字、半角英大文字、数字を各1種類以上含んでください'

export const loginValidationSchema = yup.object().shape({
  email: yup.string().required(requireEmail).email(violationEmail),
  password: yup
    .string()
    .required(requirePassword)
    .min(6, violationPasswordMin)
    .max(20, violationPasswordMax)
    .matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      violationPasswordRegExp
    ),
})
