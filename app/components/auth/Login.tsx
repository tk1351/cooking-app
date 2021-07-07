import React, { VFC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuidv4 } from 'uuid'
import { Grid, Container, Typography } from '@material-ui/core'
import { ILoginUser } from '../../re-ducks/auth/type'
import { useAppDispatch } from '../../re-ducks/hooks'
import { loginUser, fetchCurrentUser } from '../../re-ducks/auth/authSlice'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { loginValidationSchema } from '../form/validations/loginValidation'
import Alert from '../common/Alert'
import { setAlert } from '../../re-ducks/alert/alertSlice'
import { MyKnownError } from '../../re-ducks/defaultType'
import styles from '../../styles/components/auth/login.module.css'

interface ILoginInputs {
  email: string
  password: string
}

const defaultValues: ILoginInputs = {
  email: '',
  password: '',
}

const Login: VFC = () => {
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
    }
  }

  return (
    <>
      <Alert />
      <Container component="main" maxWidth="xs">
        <Grid container justify="center" className={styles.h1}>
          <h1>ログイン</h1>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <TextForm
                label={'メールアドレス'}
                id="email"
                type="email"
                name="email"
                variant="outlined"
                onChange={onChange}
                inputRef={ref}
                error={Boolean(errors.email)}
                helperText={errors.email && errors.email.message}
                className={styles.textField}
                fullWidth
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <TextForm
                label={'パスワード'}
                id="password"
                type="text"
                name="password"
                variant="outlined"
                onChange={onChange}
                inputRef={ref}
                error={Boolean(errors.password)}
                helperText={errors.password && errors.password.message}
                className={styles.textField}
                fullWidth
              />
            )}
          />
          <FormButton
            type="submit"
            variant="contained"
            color="primary"
            label={'ログイン'}
            className={styles.button}
          />
        </form>
        <Grid container justify="center">
          <Typography variant="body2" color="textPrimary" component="p">
            ユーザー登録がお済みでない方はこちら
          </Typography>
        </Grid>
        <Grid container justify="center">
          <Link href="/register">
            <Typography
              variant="body2"
              color="textPrimary"
              component="p"
              className={styles.link}
            >
              ユーザー登録
            </Typography>
          </Link>
        </Grid>
      </Container>
    </>
  )
}

export default Login
