import React, { VFC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuidv4 } from 'uuid'
import { ILoginUser } from '../../re-ducks/auth/type'
import { useAppDispatch } from '../../re-ducks/hooks'
import { loginUser, fetchCurrentUser } from '../../re-ducks/auth/authSlice'
import { useIsAuthenticated } from '../common/useIsAuthenticated'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { loginValidationSchema } from '../form/validations/loginValidation'
import Alert from '../common/Alert'
import { setAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import { MyKnownError } from '../../re-ducks/defaultType'

interface ILoginInputs {
  email: string
  password: string
}

const defaultValues: ILoginInputs = {
  email: '',
  password: '',
}

const Login: VFC = () => {
  useIsAuthenticated()

  const dispatch = useAppDispatch()
  const { control, handleSubmit } = useForm<ILoginInputs>({
    defaultValues,
    resolver: yupResolver(loginValidationSchema),
  })

  const router = useRouter()

  const onSubmit: SubmitHandler<ILoginInputs> = async ({ email, password }) => {
    const userData: ILoginUser = { email, password }
    const resultAction = await dispatch(loginUser(userData))
    if (loginUser.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      await dispatch(fetchCurrentUser())
      await router.push('/')
    } else if (loginUser.rejected.match(resultAction)) {
      const payload = resultAction.payload as MyKnownError
      const alertId = uuidv4()
      dispatch(
        setAlert({
          alertId,
          msg: payload.message as string,
          alertType: 'failed',
        })
      )
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)
    }
  }

  return (
    <>
      <Alert />
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              head={'メールアドレス'}
              label={'メールアドレス'}
              id="email"
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
              head={'パスワード'}
              label={'パスワード'}
              id="password"
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
        <FormButton
          type="submit"
          variant="contained"
          color="primary"
          label={'ログイン'}
        />
      </form>
      <p>
        ユーザー登録がお済みでない方はこちら
        <Link href="/register">ユーザー登録</Link>
      </p>
    </>
  )
}

export default Login
