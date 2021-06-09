import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from 'react-hook-form'
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { unwrapResult } from '@reduxjs/toolkit'
import { IUser, IUpdateAdminProfileInputs } from '../../re-ducks/auth/type'
import { useAppDispatch } from '../../re-ducks/hooks'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { updateAdminProfile } from '../../re-ducks/auth/authSlice'

type Props = {
  user: IUser
}

const EditProfileForm: VFC<Props> = ({ user }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const defaultValues: IUpdateAdminProfileInputs = {
    name: user.name,
    favoriteDish: user.favoriteDish,
    specialDish: user.specialDish,
    bio: user.bio,
    socials: user.socials,
  }

  const { control, handleSubmit } = useForm<IUpdateAdminProfileInputs>({
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socials',
  })

  const onSubmit: SubmitHandler<IUpdateAdminProfileInputs> = async (data) => {
    const resultAction = await dispatch(
      updateAdminProfile({
        profile: data,
        id: user.id,
      })
    )
    if (updateAdminProfile.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)
      router.push(`/admin/${user.id}`)
    }
  }

  return (
    <div>
      <h1>管理者プロフィール編集</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              label={'好きな料理'}
              placeholder={'好きな料理を入力してください'}
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
              label={'得意料理'}
              placeholder={'得意料理を入力してください'}
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
        <Controller
          name="bio"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              label={'自己紹介'}
              placeholder={'自己紹介を入力してください'}
              type="text"
              name="bio"
              variant="outlined"
              defaultValue={user.bio}
              onChange={onChange}
              inputRef={ref}
              error={Boolean(errors.bio)}
              helperText={errors.bio && errors.bio.message}
            />
          )}
        />
        {/* SNS欄 */}
        <ul>
          {fields.map((item, index) => (
            <li key={item.id}>
              <Controller
                name={`socials[${index}].category`}
                control={control}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <FormControl variant="outlined">
                    <InputLabel>SNS</InputLabel>
                    <Select
                      label={'SNS'}
                      name={`socials[${index}].category`}
                      defaultValue={item.category}
                      onChange={onChange}
                      error={Boolean(errors.socials && errors.socials[index])}
                    >
                      <MenuItem value={1}>Twitter</MenuItem>
                      <MenuItem value={2}>Youtube</MenuItem>
                      <MenuItem value={3}>Instagram</MenuItem>
                      <MenuItem value={4}>Facebook</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name={`socials[${index}].url`}
                control={control}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    label={'URL'}
                    placeholder={'URLを入力してください'}
                    type="text"
                    name={`socials[${index}].url`}
                    defaultValue={item.url}
                    variant="outlined"
                    onChange={onChange}
                    inputRef={ref}
                    error={Boolean(errors.socials && errors.socials[index])}
                    helperText={
                      errors.socials && errors.socials[index]?.url?.message
                    }
                  />
                )}
              />
              <button type="button" onClick={() => remove(index)}>
                ×
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            append({
              category: 1,
              url: '',
            })
          }
        >
          +
        </button>
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
