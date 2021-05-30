import * as yup from 'yup'

const requireName = 'ユーザー名を入力してください'
const violationNameMin = 'ユーザー名は4字以上入力してください'
const violationNameMax = 'ユーザー名は20字以内で入力してください'
const requireEmail = 'メールアドレスを入力してください'
const violationEmail = '正しい形式で入力してください'
const requirePassword = 'パスワードを入力してください'
const violationPasswordMin = 'パスワードは6文字以上で入力してください'
const violationPasswordMax = 'パスワードは20文字以内で入力してください'
const violationPasswordRegExp =
  '半角英小文字、半角英大文字、数字を各1種類以上含んでください'
const requireConfirmPassword = 'パスワード（確認用）を入力してください'
const violationConfirmPassword = 'パスワードが一致しません'

export const registerValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required(requireName)
    .min(4, violationNameMin)
    .max(20, violationNameMax),
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
  confirmPassword: yup
    .string()
    .required(requireConfirmPassword)
    .oneOf([yup.ref('password'), null], violationConfirmPassword),
})
