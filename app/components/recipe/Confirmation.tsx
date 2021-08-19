import React, { useState } from 'react'
import { NextPage } from 'next'
import {
  Grid,
  Typography,
  Box,
  CardMedia,
  Divider,
  Button,
  IconButton,
} from '@material-ui/core'
import { PhotoCamera } from '@material-ui/icons'
import Link from 'next/link'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from '../../re-ducks/hooks'
import {
  confirmRecipe,
  removeRecipe,
} from '../../re-ducks/confirmation/confirmationSlice'
import { IRecipeData } from '../form/type'
import { firebaseStorage } from '../../src/utils/firebase'
import { createRecipe } from '../../re-ducks/recipe/recipeSlice'
import { setAlert } from '../../re-ducks/alert/alertSlice'
import { MyKnownError } from '../../re-ducks/defaultType'
import { selectUserToken } from '../../re-ducks/auth/authSlice'
import styles from '../../styles/components/recipe/confirmation.module.css'

const Confirmation: NextPage = () => {
  const dispatch = useAppDispatch()

  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const onChangeImageHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files![0]) {
      setRecipeImage(e.target.files![0])
      setPreview(window.URL.createObjectURL(e.target.files![0]))
      e.target.value = ''
    }
  }

  const recipe = useAppSelector(confirmRecipe)
  const accessToken = useAppSelector(selectUserToken)

  const router = useRouter()

  // 調理工程のorderで昇順
  const recipeDescriptions = [...recipe.recipeDescriptions]
  const sortDescriptions = recipeDescriptions.sort((a, b) => {
    return a.order - b.order
  })

  const onSubmit = async () => {
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
      const fileName = randomChar + '_' + recipeImage.name

      await firebaseStorage.ref(`images/${fileName}`).put(recipeImage)
      imageUrl = await firebaseStorage
        .ref('images')
        .child(fileName)
        .getDownloadURL()

      try {
        const newData: IRecipeData = { ...recipe, image: imageUrl }
        const resultAction = await dispatch(
          createRecipe({
            recipeData: newData,
            accessToken,
          })
        )
        if (createRecipe.fulfilled.match(resultAction)) {
          unwrapResult(resultAction)

          dispatch(
            setAlert({
              open: true,
              msg: 'レシピを投稿しました',
              alertType: 'succeeded',
            })
          )

          dispatch(removeRecipe())
          await router.push('/')
        } else if (createRecipe.rejected.match(resultAction)) {
          const payload = resultAction.payload as MyKnownError
          dispatch(
            setAlert({
              open: true,
              msg: payload.message as string,
              alertType: 'failed',
            })
          )
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      dispatch(
        setAlert({
          open: true,
          msg: '料理画像を追加してください',
          alertType: 'failed',
        })
      )
    }
  }

  return (
    <div>
      <Grid container className={styles.recipeWrapper}>
        <Grid item xs={12}>
          <Grid container className={styles.recipeName}>
            <Typography gutterBottom variant="h4" component="h2">
              <Box fontWeight="fontWeightBold">{recipe.name}</Box>
            </Typography>
          </Grid>
          <Grid container>
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.url}
            >
              <Typography
                variant="body2"
                color="primary"
                component="p"
                className={styles.linkText}
              >
                {recipe.url}
              </Typography>
            </a>
          </Grid>
          <Grid container>
            <ul className={styles.tag}>
              {recipe.tags.map((tag, index) => (
                <div key={index}>
                  <Typography
                    variant="body2"
                    color="primary"
                    component="p"
                    className={styles.tagText}
                  >
                    #{tag.name}
                  </Typography>
                </div>
              ))}
            </ul>
          </Grid>
          <Grid container>
            <Typography variant="body2" color="textSecondary" component="p">
              {format(new Date(), 'yyyy-MM-dd')}
            </Typography>
          </Grid>
          <div className={styles.typography}>
            <Typography>料理画像</Typography>
          </div>
          <Grid container justify="center">
            <Box>
              <IconButton color="primary" component="span">
                <label>
                  <PhotoCamera style={{ fontSize: 60 }} />
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={onChangeImageHandler}
                    className={styles.image}
                  />
                </label>
              </IconButton>
            </Box>
          </Grid>
          {preview && (
            <Grid container className={styles.preview}>
              <CardMedia image={preview} component="img" />
            </Grid>
          )}
          <Grid container>
            <Typography gutterBottom variant="h6" component="h2">
              調理時間： {recipe.time}分
            </Typography>
          </Grid>
          <Grid container>
            <Grid item className={styles.divider}>
              <Divider />
            </Grid>
          </Grid>
          <Grid container className={styles.recipeElement}>
            <Typography gutterBottom variant="h6" component="h2">
              材料
            </Typography>
          </Grid>
          <Grid container className={styles.recipeChildElment}>
            <ul className={styles.ingredients}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <Typography variant="body2" color="textPrimary" component="p">
                    {ingredient.name}： {ingredient.amount}
                  </Typography>
                </li>
              ))}
            </ul>
          </Grid>
          <Grid container>
            <Grid item className={styles.divider}>
              <Divider />
            </Grid>
          </Grid>
          <Grid container className={styles.recipeElement}>
            <Typography gutterBottom variant="h6" component="h2">
              調理工程
            </Typography>
          </Grid>
          <Grid container className={styles.recipeChildElment}>
            <ul>
              {sortDescriptions.map((recipeDescription, index) => (
                <div key={index}>
                  <Typography variant="body2" color="textPrimary" component="p">
                    {recipeDescription.order}： {recipeDescription.text}
                  </Typography>
                  {recipeDescription.url && (
                    <a
                      href={recipeDescription.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography
                        variant="body2"
                        color="primary"
                        component="p"
                        className={styles.a}
                      >
                        参考：{recipeDescription.url}
                      </Typography>
                    </a>
                  )}
                </div>
              ))}
            </ul>
          </Grid>
          <Grid container>
            {recipe.remarks && (
              <Grid item className={styles.divider}>
                <Divider />
              </Grid>
            )}
          </Grid>
          <Grid container className={styles.recipeElement}>
            {recipe.remarks && (
              <Typography gutterBottom variant="h6" component="h2">
                補足
              </Typography>
            )}
          </Grid>
          <Grid container>
            {recipe.remarks && (
              <Typography variant="body2" color="textPrimary" component="p">
                {recipe.remarks}
              </Typography>
            )}
          </Grid>
          <Grid container className={styles.buttonWrapper}>
            <Button
              variant="contained"
              color="default"
              onClick={() => router.back()}
            >
              編集する
            </Button>
            <Button variant="contained" color="primary" onClick={onSubmit}>
              投稿する
            </Button>
          </Grid>
          <Grid container>
            <Link href="/">
              <p>一覧へ戻る</p>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default Confirmation
