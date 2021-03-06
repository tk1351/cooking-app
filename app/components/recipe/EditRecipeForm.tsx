import React, { VFC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  IconButton,
  Container,
  Grid,
  Typography,
} from '@material-ui/core'
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from 'react-hook-form'
import { PhotoCamera, Remove, Add } from '@material-ui/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { unwrapResult } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import { updateRecipe } from '../../re-ducks/recipe/recipeSlice'
import { IRecipe, IUpdateRecipeInputs } from '../../re-ducks/recipe/type'
import { firebaseStorage } from '../../src/utils/firebase'
import { recipeValidationSchema } from '../form/validations/recipeValidation'
import { setAlert } from '../../re-ducks/alert/alertSlice'
import { MyKnownError } from '../../re-ducks/defaultType'
import Alert from '../common/Alert'
import { selectUserToken } from '../../re-ducks/auth/authSlice'
import styles from '../../styles/components/recipe/editRecipeForm.module.css'

type Props = {
  recipe: IRecipe
}

const EditRecipeForm: VFC<Props> = ({ recipe }) => {
  const dispatch = useAppDispatch()

  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    setPreview(recipe.image)
  }, [])

  console.log('recipe', recipe)

  const defaultValues: IUpdateRecipeInputs = {
    name: recipe.name,
    time: recipe.time,
    remarks: recipe.remarks,
    image: recipe.image,
    url: recipe.url,
    ingredients: recipe.ingredients,
    recipeDescriptions: recipe.recipeDescriptions,
    tags: recipe.tags,
  }

  console.log('default', defaultValues)

  const { control, handleSubmit } = useForm<IUpdateRecipeInputs>({
    defaultValues,
    resolver: yupResolver(recipeValidationSchema),
  })

  //FIXME: fields: Record<"id", string>[]?????????????????????????????????any?????????
  // https://github.com/react-hook-form/react-hook-form/discussions/5780
  const {
    fields: ingredientFields,
    append: ingredientAppend,
    remove: ingredientRemove,
  } = useFieldArray<IUpdateRecipeInputs, any, any>({
    name: 'ingredients',
    control,
  })
  const {
    fields: recipeDescriptionFields,
    append: recipeDescriptionAppend,
    remove: recipeDescriptionRemove,
  } = useFieldArray<IUpdateRecipeInputs, any, any>({
    name: 'recipeDescriptions',
    control,
  })
  const {
    fields: tagFields,
    append: tagAppend,
    remove: tagRemove,
  } = useFieldArray<IUpdateRecipeInputs, any, any>({
    name: 'tags',
    control,
  })

  const router = useRouter()

  const onChangeImageHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files![0]) {
      setRecipeImage(e.target.files![0])
      setPreview(window.URL.createObjectURL(e.target.files![0]))
      e.target.value = ''
    }
  }

  const accessToken = useAppSelector(selectUserToken)

  const onSubmit: SubmitHandler<IUpdateRecipeInputs> = async (data) => {
    let imageUrl = ''

    // ???????????????????????????
    if (recipeImage !== null) {
      const str =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const num = 16
      const randomChar = Array.from(
        crypto.getRandomValues(new Uint32Array(num))
      )
        .map((n) => str[n % str.length])
        .join('')
      const fileName = randomChar + '_' + data.image

      await firebaseStorage.ref(`images/${fileName}`).put(recipeImage)
      imageUrl = await firebaseStorage
        .ref('images')
        .child(fileName)
        .getDownloadURL()

      try {
        const newData = { ...data, image: imageUrl }
        const resultAction = await dispatch(
          updateRecipe({
            postData: newData,
            id: recipe.id,
            accessToken,
          })
        )
        if (updateRecipe.fulfilled.match(resultAction)) {
          unwrapResult(resultAction)

          const alertId = uuidv4()
          dispatch(
            setAlert({
              alertId,
              msg: '??????????????????????????????',
              alertType: 'succeeded',
            })
          )

          await router.push('/')
        } else if (updateRecipe.rejected.match(resultAction)) {
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
      } catch (error) {
        console.error(error)
      }
      // ??????????????????????????????
    } else {
      try {
        const resultAction = await dispatch(
          updateRecipe({
            postData: data,
            id: recipe.id,
            accessToken,
          })
        )
        if (updateRecipe.fulfilled.match(resultAction)) {
          unwrapResult(resultAction)

          const alertId = uuidv4()
          dispatch(
            setAlert({
              alertId,
              msg: '??????????????????????????????',
              alertType: 'succeeded',
            })
          )

          await router.push('/')
        } else if (updateRecipe.rejected.match(resultAction)) {
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
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div>
      <Alert />
      <Container component="main" maxWidth={false} className={styles.container}>
        <Grid container justify="center" className={styles.h1}>
          <h1>???????????????</h1>
        </Grid>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <>
                <div className={styles.typography}>
                  <Typography>????????????</Typography>
                </div>
                <TextForm
                  label={'????????????'}
                  id="name"
                  type="text"
                  name="name"
                  variant="outlined"
                  defaultValue={recipe.name}
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
            name="url"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <>
                <div className={styles.typography}>
                  <Typography>??????URL</Typography>
                </div>
                <TextForm
                  label={'??????URL'}
                  id="url"
                  type="text"
                  name="url"
                  variant="outlined"
                  defaultValue={recipe.url}
                  onChange={onChange}
                  inputRef={ref}
                  error={Boolean(errors.url)}
                  helperText={errors.url && errors.url.message}
                  className={styles.textField}
                  fullWidth
                />
              </>
            )}
          />
          <Controller
            name="time"
            control={control}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <FormControl variant="outlined">
                <InputLabel>????????????</InputLabel>
                <Select
                  aria-label={'????????????'}
                  label={'????????????'}
                  name="time"
                  defaultValue={recipe.time}
                  value={value ? value : recipe.time}
                  onChange={onChange}
                  error={Boolean(errors.time)}
                >
                  <MenuItem value={5}>5???</MenuItem>
                  <MenuItem value={10}>10???</MenuItem>
                  <MenuItem value={15}>15???</MenuItem>
                  <MenuItem value={20}>20???</MenuItem>
                  <MenuItem value={30}>30???</MenuItem>
                  <MenuItem value={40}>40???</MenuItem>
                  <MenuItem value={50}>50???</MenuItem>
                  <MenuItem value={60}>60?????????</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.time && errors.time.message}
                </FormHelperText>
              </FormControl>
            )}
          />
          {/* ?????? */}
          <ul>
            <div className={styles.typography}>
              <Typography>??????</Typography>
            </div>
            {ingredientFields.map((field, index) => (
              <li key={field.id} className={styles.li}>
                <Controller
                  name={`ingredients.${index}.name`}
                  control={control}
                  defaultValue={field.name ? field.name : ''}
                  render={({
                    field: { onChange, ref },
                    formState: { errors },
                  }) => (
                    <TextForm
                      label={'?????????'}
                      id={`ingredients[${index}].name`}
                      type="text"
                      name={`ingredients[${index}].name`}
                      defaultValue={field.name}
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      error={Boolean(
                        errors.ingredients && errors.ingredients[index]
                      )}
                      helperText={
                        errors.ingredients &&
                        errors.ingredients[index]?.name?.message
                      }
                      className={styles.textField}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name={`ingredients.${index}.amount`}
                  control={control}
                  defaultValue={field.amount ? field.amount : ''}
                  render={({ field: { onChange }, formState: { errors } }) => (
                    <TextForm
                      label={'??????'}
                      id={`ingredients[${index}].amount`}
                      type="text"
                      name={`ingredients[${index}].amount`}
                      defaultValue={field.amount}
                      variant="outlined"
                      onChange={onChange}
                      error={Boolean(
                        errors.ingredients && errors.ingredients[index]
                      )}
                      helperText={
                        errors.ingredients &&
                        errors.ingredients[index]?.amount?.message
                      }
                      className={styles.textField}
                      fullWidth
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={() => ingredientRemove(index)}
                  className={styles.button}
                >
                  <Remove />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            fullWidth
            type="button"
            variant="contained"
            color="primary"
            onClick={() =>
              ingredientAppend({
                name: '',
                amount: '',
              })
            }
            className={styles.button}
          >
            <Add />
          </Button>
          {/* ???????????? */}
          <ul>
            <div className={styles.typography}>
              <Typography>????????????</Typography>
            </div>
            {recipeDescriptionFields.map((field, index) => (
              <li key={field.id} className={styles.li}>
                <Controller
                  name={`recipeDescriptions.${index}.order`}
                  control={control}
                  defaultValue={Number(field.order)}
                  render={({
                    field: { onChange, ref },
                    formState: { errors },
                  }) => (
                    <TextForm
                      label={'??????'}
                      id={`recipeDescriptions[${index}].order`}
                      type="text"
                      name={`recipeDescriptions[${index}].order`}
                      defaultValue={field.order}
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      error={Boolean(
                        errors.recipeDescriptions &&
                          errors.recipeDescriptions[index]
                      )}
                      helperText={
                        errors.recipeDescriptions &&
                        errors.recipeDescriptions[index]?.order?.message
                      }
                      className={`${styles.textField} ${styles.order}`}
                    />
                  )}
                />
                <Controller
                  name={`recipeDescriptions.${index}.text`}
                  control={control}
                  defaultValue={field.text ? field.text : ''}
                  render={({
                    field: { onChange, ref },
                    formState: { errors },
                  }) => (
                    <TextForm
                      label={'??????'}
                      id={`recipeDescriptions[${index}].text`}
                      type="text"
                      name={`recipeDescriptions[${index}].text`}
                      defaultValue={field.text}
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      error={Boolean(
                        errors.recipeDescriptions &&
                          errors.recipeDescriptions[index]
                      )}
                      helperText={
                        errors.recipeDescriptions &&
                        errors.recipeDescriptions[index]?.text?.message
                      }
                      className={styles.textField}
                    />
                  )}
                />
                <Controller
                  name={`recipeDescriptions.${index}.url`}
                  control={control}
                  defaultValue={field.url ? field.url : ''}
                  render={({
                    field: { onChange, ref },
                    formState: { errors },
                  }) => (
                    <TextForm
                      label={'URL'}
                      id={`recipeDescriptions[${index}].url`}
                      type="text"
                      name={`recipeDescriptions[${index}].url`}
                      defaultValue={field.url}
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      error={Boolean(
                        errors.recipeDescriptions &&
                          errors.recipeDescriptions[index]
                      )}
                      helperText={
                        errors.recipeDescriptions &&
                        errors.recipeDescriptions[index]?.url?.message
                      }
                      className={styles.textField}
                    />
                  )}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={() => recipeDescriptionRemove(index)}
                  className={styles.button}
                >
                  <Remove />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="button"
            onClick={() =>
              recipeDescriptionAppend({
                order: recipeDescriptionFields.length + 1,
                text: '',
                url: '',
              })
            }
            className={styles.button}
          >
            <Add />
          </Button>
          {/* ?????? */}
          <ul>
            <div className={styles.typography}>
              <Typography>??????</Typography>
            </div>
            {tagFields.map((field, index) => (
              <li key={field.id} className={styles.li}>
                <Controller
                  name={`tags.${index}.name`}
                  control={control}
                  defaultValue={field.name ? field.name : ''}
                  render={({
                    field: { onChange, ref },
                    formState: { errors },
                  }) => (
                    <TextForm
                      label={'?????????'}
                      id={`tags[${index}].name`}
                      type="text"
                      name={`tags[${index}].name`}
                      defaultValue={field.name}
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      error={Boolean(errors.tags && errors.tags[index])}
                      helperText={
                        errors.tags && errors.tags[index]?.name?.message
                      }
                      className={styles.textField}
                    />
                  )}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={() => tagRemove(index)}
                  className={styles.button}
                >
                  <Remove />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="button"
            onClick={() =>
              tagAppend({
                name: '',
              })
            }
            className={styles.button}
          >
            <Add />
          </Button>
          <Controller
            name="remarks"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <>
                <div className={styles.typography}>
                  <Typography>??????</Typography>
                </div>
                <TextForm
                  label={'??????'}
                  id="remarks"
                  type="text"
                  name="remarks"
                  defaultValue={recipe.remarks}
                  variant="outlined"
                  onChange={onChange}
                  inputRef={ref}
                  error={Boolean(errors.remarks)}
                  helperText={errors.remarks && errors.remarks.message}
                  className={styles.textField}
                  fullWidth
                  multiline
                  rows={3}
                />
              </>
            )}
          />
          <Grid container justify="center">
            <Box>
              <IconButton color="primary" component="span">
                <label>
                  <PhotoCamera fontSize="large" />
                  <input
                    name="image"
                    type="file"
                    onChange={onChangeImageHandler}
                    className={styles.image}
                  />
                </label>
              </IconButton>
            </Box>
          </Grid>
          <Grid container justify="center">
            {preview && <img src={preview} className={styles.preview} />}
          </Grid>
          <FormButton
            type="submit"
            variant="contained"
            color="primary"
            label="??????"
          />
        </form>
      </Container>
      <Button onClick={() => router.back()}>??????</Button>
    </div>
  )
}

export default EditRecipeForm
