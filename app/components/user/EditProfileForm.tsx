import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { unwrapResult } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { IUser, IUpdateUserProfileInputs } from '../../re-ducks/auth/type'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { Button } from '@material-ui/core'
import { useAppDispatch } from '../../re-ducks/hooks'
import { updateUserProfile } from '../../re-ducks/auth/authSlice'
import { setAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import { MyKnownError } from '../../re-ducks/defaultType'
import Alert from '../common/Alert'

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

  const onSubmit: SubmitHandler<IUpdateUserProfileInputs> = async (data) => {
    const resultAction = await dispatch(
      updateUserProfile({ profile: data, id: user.id })
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
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)

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
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)
    }
  }

  return (
    <div>
      <Alert />
      <h1>プロフィール編集</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              head={'ユーザー名'}
              label={'ユーザー名'}
              placeholder={'ユーザー名を入力してください'}
              id="name"
              type="text"
              name="name"
              variant="outlined"
              defaultValue={user.name}
              onChange={onChange}
              inputRef={ref}
              error={Boolean(errors.name)}
              helperText={errors.name && errors.name.message}
            />
          )}
        />
        <Controller
          name="favoriteDish"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              head={'好きな料理'}
              label={'好きな料理'}
              placeholder={'好きな料理を入力してください'}
              id="favoriteDish"
              type="text"
              name="favoriteDish"
              variant="outlined"
              defaultValue={user.favoriteDish}
              onChange={onChange}
              inputRef={ref}
              error={Boolean(errors.favoriteDish)}
              helperText={errors.favoriteDish && errors.favoriteDish.message}
            />
          )}
        />
        <Controller
          name="specialDish"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              head={'得意料理'}
              label={'得意料理'}
              placeholder={'得意料理を入力してください'}
              id="specialDish"
              type="text"
              name="specialDish"
              variant="outlined"
              defaultValue={user.specialDish}
              onChange={onChange}
              inputRef={ref}
              error={Boolean(errors.specialDish)}
              helperText={errors.specialDish && errors.specialDish.message}
            />
          )}
        />
        <FormButton
          type="submit"
          variant="contained"
          color="primary"
          label="更新"
        />
      </form>
      <Button onClick={() => router.back()}>戻る</Button>
    </div>
  )
}

export default EditProfileForm
