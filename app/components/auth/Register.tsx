import React, { VFC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { RegisterUser } from '../../re-ducks/auth/type'
import { useAppDispatch } from '../../re-ducks/hooks'
import { registerUser } from '../../re-ducks/auth/authSlice'
import { useIsAuthenticated } from '../common/useIsAuthenticated'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import TextForm from '../form/TextForm'
import { registerValidationSchema } from '../form/validations/registerValidation'
import FormButton from '../form/FormButton'

interface IRegisterInputs {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const defaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const Register: VFC = () => {
  useIsAuthenticated()

  const dispatch = useAppDispatch()
  const { control, handleSubmit } = useForm<IRegisterInputs>({
    defaultValues,
    resolver: yupResolver(registerValidationSchema),
  })

  const router = useRouter()

  const onSubmit: SubmitHandler<IRegisterInputs> = async ({
    name,
    email,
    password,
  }) => {
    const userData: RegisterUser = { name, email, password }
    const resultAction = await dispatch(registerUser(userData))
    if (registerUser.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      await router.push('/login')
    }
  }

  return (
    <>
      <h1>ユーザー登録</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              label={'ユーザー名'}
              placeholder={'ユーザー名を入力してください'}
              type="text"
              name="name"
              variant="outlined"
              onChange={onChange}
              inputRef={ref}
              error={Boolean(errors.name)}
              helperText={errors.name && errors.name.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              label={'メールアドレス'}
              placeholder={'メールアドレスを入力してください'}
              type="email"
              name="email"
              variant="outlined"
              onChange={onChange}
              inputRef={ref}
              error={Boolean(errors.email)}
              helperText={errors.email && errors.email.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              label={'パスワード'}
              placeholder={'パスワードを入力してください'}
              type="text"
              name="password"
              variant="outlined"
              onChange={onChange}
              inputRef={ref}
              error={Boolean(errors.password)}
              helperText={errors.password && errors.password.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              label={'パスワード（確認用）'}
              placeholder={'上記と同じパスワードを入力してください'}
              type="text"
              name="confirmPassword"
              variant="outlined"
              onChange={onChange}
              inputRef={ref}
              error={Boolean(errors.confirmPassword)}
              helperText={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
          )}
        />
        <FormButton
          type="submit"
          variant="contained"
          color="primary"
          label={'ユーザー登録'}
        />
      </form>
      <p>
        既にアカウントをお持ちの方はこちら
        <Link href="/login">ログイン</Link>
      </p>
    </>
  )
}

export default Register
