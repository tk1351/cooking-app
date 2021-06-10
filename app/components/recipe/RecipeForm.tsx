import React, { VFC, useState } from 'react'
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from 'react-hook-form'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  IconButton,
} from '@material-ui/core'
import { PhotoCamera } from '@material-ui/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { useIsAdmin } from '../common/useIsAdmin'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { recipeValidationSchema } from '../form/validations/recipeValidation'
import { useAppDispatch } from '../../re-ducks/hooks'
import { createRecipe } from '../../re-ducks/recipe/recipeSlice'
import { IRecipeInputs } from '../form/type'
import { firebaseStorage } from '../../src/utils/firebase'
import { setAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import { MyKnownError } from '../../re-ducks/defaultType'
import Alert from '../common/Alert'

const defaultValues: IRecipeInputs = {
  name: '',
  time: 5,
  remarks: '',
  image: '',
  ingredients: [
    {
      name: '',
      amount: '',
    },
  ],
  recipeDescriptions: [
    {
      order: 1,
      text: '',
      url: '',
    },
  ],
  tags: [{ name: '' }],
}

const RecipeForm: VFC = () => {
  useIsAdmin()

  const dispatch = useAppDispatch()

  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const { control, handleSubmit } = useForm<IRecipeInputs>({
    defaultValues,
    resolver: yupResolver(recipeValidationSchema),
  })

  // 材料の配列フォーム定義
  const {
    fields: ingredientFields,
    append: ingredientAppend,
    remove: ingredientRemove,
  } = useFieldArray({ control, name: 'ingredients' })

  // 調理工程の配列フォーム定義
  const {
    fields: recipeDescriptionFields,
    append: recipeDescriptionAppend,
    remove: recipeDescriptionRemove,
  } = useFieldArray({ control, name: 'recipeDescriptions' })

  // タグの配列フォーム定義
  const {
    fields: tagFields,
    append: tagAppend,
    remove: tagRemove,
  } = useFieldArray({ control, name: 'tags' })

  const onChangeImageHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files![0]) {
      setRecipeImage(e.target.files![0])
      setPreview(window.URL.createObjectURL(e.target.files![0]))
      e.target.value = ''
    }
  }

  const router = useRouter()

  const onSubmit: SubmitHandler<IRecipeInputs> = async (data) => {
    let imageUrl = ''

    if (recipeImage) {
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
        const resultAction = await dispatch(createRecipe(newData))
        if (createRecipe.fulfilled.match(resultAction)) {
          unwrapResult(resultAction)

          const alertId = uuidv4()
          dispatch(
            setAlert({
              alertId,
              msg: 'レシピを投稿しました',
              alertType: 'succeeded',
            })
          )
          setTimeout(() => dispatch(removeAlert({ alertId })), 5000)

          await router.push('/')
        } else if (createRecipe.rejected.match(resultAction)) {
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
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div>
      <Alert />
      <h1>レシピ投稿</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              label={'レシピ名'}
              placeholder={'レシピ名を入力してください'}
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
          name="time"
          control={control}
          render={({ field: { onChange, value }, formState: { errors } }) => (
            <FormControl variant="outlined">
              <InputLabel>調理時間</InputLabel>
              <Select
                label={'調理時間'}
                name="time"
                defaultValue={5}
                value={value ? value : 5}
                onChange={onChange}
                error={Boolean(errors.time)}
              >
                <MenuItem value={5}>5分</MenuItem>
                <MenuItem value={10}>10分</MenuItem>
                <MenuItem value={15}>15分</MenuItem>
                <MenuItem value={20}>20分</MenuItem>
                <MenuItem value={30}>30分</MenuItem>
                <MenuItem value={40}>40分</MenuItem>
                <MenuItem value={50}>50分</MenuItem>
                <MenuItem value={60}>60分以上</MenuItem>
              </Select>
              <FormHelperText>
                {errors.time && errors.time.message}
              </FormHelperText>
            </FormControl>
          )}
        />
        {/* 材料 */}
        <ul>
          {ingredientFields.map((field, index) => (
            <li key={field.id}>
              <Controller
                name={`ingredients[${index}].name`}
                control={control}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    label={'材料名'}
                    placeholder={'材料名を入力してください'}
                    type="text"
                    name={`ingredients[${index}].name`}
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
                  />
                )}
              />
              <Controller
                name={`ingredients[${index}].amount`}
                control={control}
                render={({ field: { onChange }, formState: { errors } }) => (
                  <TextForm
                    label={'分量'}
                    placeholder={'分量を入力してください'}
                    type="text"
                    name={`ingredients[${index}].amount`}
                    variant="outlined"
                    onChange={onChange}
                    error={Boolean(
                      errors.ingredients && errors.ingredients[index]
                    )}
                    helperText={
                      errors.ingredients &&
                      errors.ingredients[index]?.amount?.message
                    }
                  />
                )}
              />
              <button type="button" onClick={() => ingredientRemove(index)}>
                ×
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => ingredientAppend({})}>
          +
        </button>
        {/* 調理工程 */}
        <ul>
          {recipeDescriptionFields.map((field, index) => (
            <li key={field.id}>
              <Controller
                name={`recipeDescriptions[${index}].order`}
                control={control}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    label={'順番'}
                    placeholder={'調理工程の順番を入力してください'}
                    type="number"
                    name={`recipeDescriptions[${index}].order`}
                    value={index + 1}
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
                  />
                )}
              />
              <Controller
                name={`recipeDescriptions[${index}].text`}
                control={control}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    label={'詳細'}
                    placeholder={'調理工程の詳細を入力してください'}
                    type="text"
                    name={`recipeDescriptions[${index}].text`}
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
                  />
                )}
              />
              <Controller
                name={`recipeDescriptions[${index}].url`}
                control={control}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    label={'URL'}
                    placeholder={'必要な場合は動画のURLを入力してください'}
                    type="text"
                    name={`recipeDescriptions[${index}].url`}
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
                  />
                )}
              />
              <button
                type="button"
                onClick={() => recipeDescriptionRemove(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => recipeDescriptionAppend({})}>
          +
        </button>
        {/* タグ */}
        <ul>
          {tagFields.map((field, index) => (
            <li key={field.id}>
              <Controller
                name={`tags[${index}].name`}
                control={control}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    label={'タグ名'}
                    placeholder={'タグ名を入力してください'}
                    type="text"
                    name={`tags[${index}].name`}
                    variant="outlined"
                    onChange={onChange}
                    inputRef={ref}
                    error={Boolean(errors.tags && errors.tags[index])}
                    helperText={
                      errors.tags && errors.tags[index]?.name?.message
                    }
                  />
                )}
              />
              <button type="button" onClick={() => tagRemove(index)}>
                ×
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => tagAppend({})}>
          +
        </button>
        <Controller
          name="remarks"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              label={'補足'}
              placeholder={'補足を入力してください'}
              type="text"
              name="remarks"
              variant="outlined"
              onChange={onChange}
              inputRef={ref}
              error={Boolean(errors.remarks)}
              helperText={errors.remarks && errors.remarks.message}
            />
          )}
        />
        <Box>
          <IconButton color="primary" component="span">
            <label>
              <PhotoCamera fontSize="large" />
              <input name="image" type="file" onChange={onChangeImageHandler} />
            </label>
          </IconButton>
        </Box>
        {preview && <img src={preview} />}
        <FormButton
          type="submit"
          variant="contained"
          color="primary"
          label="投稿"
        />
      </form>
    </div>
  )
}

export default RecipeForm
