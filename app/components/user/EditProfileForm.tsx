import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { unwrapResult } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { IUser, IUpdateUserProfileInputs } from '../../re-ducks/auth/type'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { Button, Container, Grid, Typography } from '@material-ui/core'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import {
  updateUserProfile,
  selectUserToken,
} from '../../re-ducks/auth/authSlice'
import { setAlert } from '../../re-ducks/alert/alertSlice'
import { MyKnownError } from '../../re-ducks/defaultType'
import Alert from '../common/Alert'
import styles from '../../styles/components/user/editProfileForm.module.css'

type Props = {
  user: IUser
}

const EditProfileForm: VFC<Props> = ({ user }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const defaultValues: IUpdateUserProfileInputs = {
    name: user.name,
    favoriteDish: user.favoriteDish,
    specialDish: user.specialDish,
  }

  const { control, handleSubmit } = useForm<IUpdateUserProfileInputs>({
    defaultValues,
  })

  const accessToken = useAppSelector(selectUserToken)

  const onSubmit: SubmitHandler<IUpdateUserProfileInputs> = async (data) => {
    const resultAction = await dispatch(
      updateUserProfile({ profile: data, id: user.id, accessToken })
    )
    if (updateUserProfile.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      const alertId = uuidv4()
      dispatch(
        setAlert({
          alertId,
          msg: 'プロフィールを更新しました',
          alertType: 'succeeded',
        })
      )

      await router.push(`/user/${user.id}`)
    } else if (updateUserProfile.rejected.match(resultAction)) {
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
    <div>
      <Alert />
      <Container component="main" maxWidth={false} className={styles.container}>
        <Grid container justify="center" className={styles.h1}>
          <h1>プロフィール編集</h1>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <>
                <div className={styles.typography}>
                  <Typography>ユーザー名</Typography>
                </div>
                <TextForm
                  label={'ユーザー名'}
                  id="name"
                  type="text"
                  name="name"
                  variant="outlined"
                  defaultValue={user.name}
                  onChange={onChange}
                  inputRef={ref}
                  error={Boolean(errors.name)}
                  helperText={errors.name && errors.name.message}
                  className={styles.textField}
                  fullWidth
                />
              </>
            )}
          />
          <Controller
            name="favoriteDish"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <>
                <div className={styles.typography}>
                  <Typography>好きな料理</Typography>
                </div>
                <TextForm
                  label={'好きな料理'}
                  id="favoriteDish"
                  type="text"
                  name="favoriteDish"
                  variant="outlined"
                  defaultValue={user.favoriteDish}
                  onChange={onChange}
                  inputRef={ref}
                  error={Boolean(errors.favoriteDish)}
                  helperText={
                    errors.favoriteDish && errors.favoriteDish.message
                  }
                  className={styles.textField}
                  fullWidth
                />
              </>
            )}
          />
          <Controller
            name="specialDish"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <>
                <div className={styles.typography}>
                  <Typography>得意料理</Typography>
                </div>
                <TextForm
                  label={'得意料理'}
                  id="specialDish"
                  type="text"
                  name="specialDish"
                  variant="outlined"
                  defaultValue={user.specialDish}
                  onChange={onChange}
                  inputRef={ref}
                  error={Boolean(errors.specialDish)}
                  helperText={errors.specialDish && errors.specialDish.message}
                  className={styles.textField}
                  fullWidth
                />
              </>
            )}
          />
          <FormButton
            type="submit"
            variant="contained"
            color="primary"
            label="更新"
          />
        </form>
        <Grid container>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => router.back()}
            className={styles.back}
          >
            戻る
          </Button>
        </Grid>
      </Container>
    </div>
  )
}

export default EditProfileForm
