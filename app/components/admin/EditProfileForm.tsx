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
  Container,
  Grid,
  Typography,
} from '@material-ui/core'
import { unwrapResult } from '@reduxjs/toolkit'
import { IUser, IUpdateAdminProfileInputs } from '../../re-ducks/auth/type'
import { useAppDispatch } from '../../re-ducks/hooks'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { updateAdminProfile } from '../../re-ducks/auth/authSlice'
import styles from '../../styles/components/admin/editProfileForm.module.css'
import { Remove, Add } from '@material-ui/icons'

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

  //FIXME: fields: Record<"id", string>[]のバグの疑いがあるのでanyにする
  // https://github.com/react-hook-form/react-hook-form/discussions/5780
  const { fields, append, remove } = useFieldArray<
    IUpdateAdminProfileInputs,
    any,
    any
  >({
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
      <Container component="main" maxWidth={false} className={styles.container}>
        <Grid container justify="center" className={styles.h1}>
          <h1>管理者プロフィール編集</h1>
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
          <Controller
            name="bio"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <>
                <div className={styles.typography}>
                  <Typography>自己紹介</Typography>
                </div>
                <TextForm
                  label={'自己紹介'}
                  id="bio"
                  type="text"
                  name="bio"
                  variant="outlined"
                  defaultValue={user.bio}
                  onChange={onChange}
                  inputRef={ref}
                  error={Boolean(errors.bio)}
                  helperText={errors.bio && errors.bio.message}
                  fullWidth
                  multiline
                  rows={5}
                />
              </>
            )}
          />
          {/* SNS欄 */}
          <ul>
            <div className={styles.typography}>
              <Typography>SNS</Typography>
            </div>
            {fields.map((item, index) => (
              <li key={item.id} className={styles.li}>
                <Controller
                  name={`socials[${index}].category`}
                  control={control}
                  render={({ field: { onChange }, formState: { errors } }) => (
                    <FormControl variant="outlined" className={styles.select}>
                      <InputLabel>SNS</InputLabel>
                      <Select
                        aria-label={'SNS'}
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
                    <div className={styles.snsUrl}>
                      <TextForm
                        label={'URL'}
                        id={`socials[${index}].url`}
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
                        className={styles.textField}
                        fullWidth
                      />
                    </div>
                  )}
                />
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={() => remove(index)}
                  className={styles.button}
                >
                  <Remove />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() =>
              append({
                category: 1,
                url: '',
              })
            }
            className={styles.button}
          >
            <Add />
          </Button>
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
