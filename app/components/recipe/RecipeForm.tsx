import React, { VFC } from 'react'
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
  Container,
  Button,
  Grid,
  Typography,
} from '@material-ui/core'
import { Add, Remove } from '@material-ui/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import TextForm from '../form/TextForm'
import FormButton from '../form/FormButton'
import { recipeValidationSchema } from '../form/validations/recipeValidation'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import { IRecipeInputs } from '../form/type'
import Alert from '../common/Alert'
import styles from '../../styles/components/recipe/recipeForm.module.css'
import {
  setRecipe,
  confirmRecipe,
} from '../../re-ducks/confirmation/confirmationSlice'

const RecipeForm: VFC = () => {
  const dispatch = useAppDispatch()

  const recipe = useAppSelector(confirmRecipe)

  const defaultValues: IRecipeInputs = {
    name: recipe.name,
    time: recipe.time,
    remarks: recipe.remarks,
    ingredients: recipe.ingredients,
    recipeDescriptions: recipe.recipeDescriptions,
    tags: recipe.tags,
  }

  const { control, handleSubmit } = useForm<IRecipeInputs>({
    defaultValues,
    resolver: yupResolver(recipeValidationSchema),
  })

  //FIXME: fields: Record<"id", string>[]のバグの疑いがあるのでanyにする
  // https://github.com/react-hook-form/react-hook-form/discussions/5780
  // 材料の配列フォーム定義
  const {
    fields: ingredientFields,
    append: ingredientAppend,
    remove: ingredientRemove,
  } = useFieldArray<IRecipeInputs, any, any>({ control, name: 'ingredients' })

  // 調理工程の配列フォーム定義
  const {
    fields: recipeDescriptionFields,
    append: recipeDescriptionAppend,
    remove: recipeDescriptionRemove,
  } = useFieldArray<IRecipeInputs, any, any>({
    control,
    name: 'recipeDescriptions',
  })

  // タグの配列フォーム定義
  const {
    fields: tagFields,
    append: tagAppend,
    remove: tagRemove,
  } = useFieldArray<IRecipeInputs, any, any>({ control, name: 'tags' })

  const router = useRouter()

  const onSubmit: SubmitHandler<IRecipeInputs> = async (data) => {
    try {
      dispatch(setRecipe(data))
      await router.push('/confirmation')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Alert />
      <Container component="main" maxWidth={false} className={styles.container}>
        <Grid container justify="center" className={styles.h1}>
          <h1>レシピ投稿</h1>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, ref }, formState: { errors } }) => (
              <>
                <div className={styles.typography}>
                  <Typography>レシピ名</Typography>
                </div>
                <TextForm
                  label={'レシピ名'}
                  id="name"
                  type="text"
                  name="name"
                  variant="outlined"
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
            name="time"
            control={control}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <FormControl variant="outlined" className={styles.select}>
                <InputLabel>調理時間</InputLabel>
                <Select
                  aria-label={'調理時間'}
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
            <div className={styles.typography}>
              <Typography>材料</Typography>
            </div>
            {ingredientFields.map((field, index) => (
              <li key={field.id} className={styles.li}>
                <Controller
                  name={`ingredients[${index}].name`}
                  control={control}
                  defaultValue={field.name ? field.name : ''}
                  render={({
                    field: { onChange, ref },
                    formState: { errors },
                  }) => (
                    <TextForm
                      label={'材料名'}
                      id={`ingredients[${index}].name`}
                      type="text"
                      name={`ingredients[${index}].name`}
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      defaultValue={field.name}
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
                  name={`ingredients[${index}].amount`}
                  control={control}
                  defaultValue={field.amount ? field.amount : ''}
                  render={({ field: { onChange }, formState: { errors } }) => (
                    <TextForm
                      label={'分量'}
                      id={`ingredients[${index}].amount`}
                      type="text"
                      name={`ingredients[${index}].amount`}
                      variant="outlined"
                      defaultValue={field.amount}
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
                  variant="contained"
                  color="secondary"
                  type="button"
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
            variant="contained"
            color="primary"
            type="button"
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
          {/* 調理工程 */}
          <ul>
            <div className={styles.typography}>
              <Typography>調理工程</Typography>
            </div>
            {recipeDescriptionFields.map((field, index) => (
              <li key={field.id} className={styles.li}>
                <Controller
                  name={`recipeDescriptions[${index}].order`}
                  control={control}
                  defaultValue={index + 1}
                  render={({
                    field: { onChange, ref },
                    formState: { errors },
                  }) => (
                    <TextForm
                      label={'順番'}
                      id={`recipeDescriptions[${index}].order`}
                      type="text"
                      name={`recipeDescriptions[${index}].order`}
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      defaultValue={index + 1}
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
                  name={`recipeDescriptions[${index}].text`}
                  control={control}
                  defaultValue={field.text ? field.text : ''}
                  render={({
                    field: { onChange, ref },
                    formState: { errors },
                  }) => (
                    <TextForm
                      label={'詳細'}
                      id={`recipeDescriptions[${index}].text`}
                      type="text"
                      name={`recipeDescriptions[${index}].text`}
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      defaultValue={field.text}
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
                  name={`recipeDescriptions[${index}].url`}
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
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      defaultValue={field.url}
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
          {/* タグ */}
          <ul>
            <div className={styles.typography}>
              <Typography>タグ</Typography>
            </div>
            {tagFields.map((field, index) => (
              <li key={field.id} className={styles.li}>
                <Controller
                  name={`tags[${index}].name`}
                  control={control}
                  defaultValue={field.name ? field.name : ''}
                  render={({
                    field: { onChange, ref },
                    formState: { errors },
                  }) => (
                    <TextForm
                      label={'タグ名'}
                      id={`tags[${index}].name`}
                      type="text"
                      name={`tags[${index}].name`}
                      variant="outlined"
                      onChange={onChange}
                      inputRef={ref}
                      defaultValue={field.name}
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
                  <Typography>補足</Typography>
                </div>
                <TextForm
                  label={'補足'}
                  id="remarks"
                  type="text"
                  name="remarks"
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

          <FormButton
            type="submit"
            variant="contained"
            color="primary"
            label="投稿内容を確認"
            className={styles.button}
          />
        </form>
      </Container>
    </div>
  )
}

export default RecipeForm
