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
} from '@material-ui/core'
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from 'react-hook-form'
import { PhotoCamera } from '@material-ui/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { unwrapResult } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { useAppDispatch } from '../../re-ducks/hooks'
import { updateRecipe } from '../../re-ducks/recipe/recipeSlice'
import { IRecipe, IUpdateRecipeInputs } from '../../re-ducks/recipe/type'
import { firebaseStorage } from '../../src/utils/firebase'
import { recipeValidationSchema } from '../form/validations/recipeValidation'
import { setAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import { MyKnownError } from '../../re-ducks/defaultType'
import Alert from '../common/Alert'

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

  const defaultValues: IUpdateRecipeInputs = {
    name: recipe.name,
    time: recipe.time,
    remarks: recipe.remarks,
    image: recipe.image,
    ingredients: recipe.ingredients,
    recipeDescriptions: recipe.recipeDescriptions,
    tags: recipe.tags,
  }

  const { control, handleSubmit } = useForm<IUpdateRecipeInputs>({
    defaultValues,
    resolver: yupResolver(recipeValidationSchema),
  })

  const {
    fields: ingredientFields,
    append: ingredientAppend,
    remove: ingredientRemove,
  } = useFieldArray({
    name: 'ingredients',
    control,
  })
  const {
    fields: recipeDescriptionFields,
    append: recipeDescriptionAppend,
    remove: recipeDescriptionRemove,
  } = useFieldArray({
    name: 'recipeDescriptions',
    control,
  })
  const {
    fields: tagFields,
    append: tagAppend,
    remove: tagRemove,
  } = useFieldArray({
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

  const onSubmit: SubmitHandler<IUpdateRecipeInputs> = async (data) => {
    let imageUrl = ''

    // 画像を更新する場合
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
          })
        )
        if (updateRecipe.fulfilled.match(resultAction)) {
          unwrapResult(resultAction)

          const alertId = uuidv4()
          dispatch(
            setAlert({
              alertId,
              msg: 'レシピを更新しました',
              alertType: 'succeeded',
            })
          )
          setTimeout(() => dispatch(removeAlert({ alertId })), 5000)

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
          setTimeout(() => dispatch(removeAlert({ alertId })), 5000)
        }
      } catch (error) {
        console.error(error)
      }
      // 画像を更新しない場合
    } else {
      try {
        const resultAction = await dispatch(
          updateRecipe({
            postData: data,
            id: recipe.id,
          })
        )
        if (updateRecipe.fulfilled.match(resultAction)) {
          unwrapResult(resultAction)

          const alertId = uuidv4()
          dispatch(
            setAlert({
              alertId,
              msg: 'レシピを更新しました',
              alertType: 'succeeded',
            })
          )
          setTimeout(() => dispatch(removeAlert({ alertId })), 5000)

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
      <h1>レシピ編集</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              head={'レシピ名'}
              label={'レシピ名'}
              id="name"
              placeholder={'レシピ名を入力してください'}
              type="text"
              name="name"
              variant="outlined"
              defaultValue={recipe.name}
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
                aria-label={'調理時間'}
                label={'調理時間'}
                name="time"
                defaultValue={recipe.time}
                value={value ? value : recipe.time}
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
                defaultValue={field.name ? field.name : ''}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    head={'材料名'}
                    label={'材料名'}
                    placeholder={'材料名を入力してください'}
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
                  />
                )}
              />
              <Controller
                name={`ingredients[${index}].amount`}
                control={control}
                defaultValue={field.amount ? field.amount : ''}
                render={({ field: { onChange }, formState: { errors } }) => (
                  <TextForm
                    head={'分量'}
                    label={'分量'}
                    placeholder={'分量を入力してください'}
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
                  />
                )}
              />
              <button type="button" onClick={() => ingredientRemove(index)}>
                ×
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            ingredientAppend({
              name: '',
              amount: '',
            })
          }
        >
          +
        </button>
        {/* 調理工程 */}
        <ul>
          {recipeDescriptionFields.map((field, index) => (
            <li key={field.id}>
              <Controller
                name={`recipeDescriptions[${index}].order`}
                control={control}
                defaultValue={field.order ? field.order : ''}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    head={'順番'}
                    label={'順番'}
                    placeholder={'調理工程の順番を入力してください'}
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
                  />
                )}
              />
              <Controller
                name={`recipeDescriptions[${index}].text`}
                control={control}
                defaultValue={field.text ? field.text : ''}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    head={'詳細'}
                    label={'詳細'}
                    placeholder={'調理工程の詳細を入力してください'}
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
                  />
                )}
              />
              <Controller
                name={`recipeDescriptions[${index}].url`}
                control={control}
                defaultValue={field.url ? field.url : ''}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    head={'URL'}
                    label={'URL'}
                    placeholder={'必要な場合は動画のURLを入力してください'}
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
        <button
          type="button"
          onClick={() =>
            recipeDescriptionAppend({
              order: recipeDescriptionFields.length + 1,
              text: '',
              url: '',
            })
          }
        >
          +
        </button>
        {/* タグ */}
        <ul>
          {tagFields.map((field, index) => (
            <li key={field.id}>
              <Controller
                name={`tags[${index}].name`}
                control={control}
                defaultValue={field.name ? field.name : ''}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => (
                  <TextForm
                    head={'タグ名'}
                    label={'タグ名'}
                    placeholder={'タグ名を入力してください'}
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
                  />
                )}
              />
              <button type="button" onClick={() => tagRemove(index)}>
                ×
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            tagAppend({
              name: '',
            })
          }
        >
          +
        </button>
        <Controller
          name="remarks"
          control={control}
          render={({ field: { onChange, ref }, formState: { errors } }) => (
            <TextForm
              head={'補足'}
              label={'補足'}
              placeholder={'補足を入力してください'}
              id="remarks"
              type="text"
              name="remarks"
              defaultValue={recipe.remarks}
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
      <Button onClick={() => router.back()}>戻る</Button>
    </div>
  )
}

export default EditRecipeForm
