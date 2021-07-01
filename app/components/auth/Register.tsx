import React, { VFC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { IRegisterUser, IRegisterInputs } from '../../re-ducks/auth/type'
import { useAppDispatch } from '../../re-ducks/hooks'
import { registerUser } from '../../re-ducks/auth/authSlice'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import TextForm from '../form/TextForm'
import { registerValidationSchema } from '../form/validations/registerValidation'
import FormButton from '../form/FormButton'
import { setAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import Alert from '../common/Alert'
import { MyKnownError } from '../../re-ducks/defaultType'
import { Grid, Container, Typography } from '@material-ui/core'
import styles from '../../styles/components/auth/register.module.css'

const defaultValues: IRegisterInputs = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const Register: VFC = () => {
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
    const userData: IRegisterUser = { name, email, password }
    const resultAction = await dispatch(registerUser(userData))
    if (registerUser.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      const alertId = uuidv4()
      dispatch(
        setAlert({
          alertId,
          msg: resultAction.payload.message,
          alertType: 'succeeded',
        })
      )
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)

      await router.push('/login')
    } else if (registerUser.rejected.match(resultAction)) {
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
      <Container component="main" maxWidth="xs">
        <Grid container justify="center" className={styles.h1}>
          <h1>ユーザー登録</h1>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <TextForm
                head={'ユーザー名'}
                label={'ユーザー名'}
                id="name"
                placeholder={'ユーザー名を入力してください'}
                type="text"
                name="name"
                variant="outlined"
                onChange={onChange}
                inputRef={ref}
                error={Boolean(errors.name)}
                helperText={errors.name && errors.name.message}
                className={styles.textField}
              />
            )}
          />
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
                className={styles.textField}
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
                className={styles.textField}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <TextForm
                head={'パスワード（確認用）'}
                label={'パスワード（確認用）'}
                id="confirmPassword"
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
                className={styles.textField}
              />
            )}
          />
          <FormButton
            type="submit"
            variant="contained"
            color="primary"
            label={'ユーザー登録'}
            className={styles.button}
          />
        </form>
        <Grid container justify="center">
          <Typography variant="body2" color="textPrimary" component="p">
            既にアカウントをお持ちの方はこちら
          </Typography>
        </Grid>
        <Grid container justify="center">
          <Link href="/login">
            <Typography
              variant="body2"
              color="textPrimary"
              component="p"
              className={styles.link}
            >
              ログイン
            </Typography>
          </Link>
        </Grid>
      </Container>
    </>
  )
}

export default Register
