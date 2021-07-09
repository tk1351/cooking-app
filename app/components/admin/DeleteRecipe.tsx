import React, { VFC } from 'react'
import {
  Typography,
  Button,
  Grid,
  Box,
  CardMedia,
  Divider,
} from '@material-ui/core'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { IRecipe } from '../../re-ducks/recipe/type'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import { deleteRecipe } from '../../re-ducks/recipe/recipeSlice'
import { setAlert } from '../../re-ducks/alert/alertSlice'
import Alert from '../common/Alert'
import { MyKnownError } from '../../re-ducks/defaultType'
import styles from '../../styles/components/admin/deleteRecipe.module.css'
import { selectUserToken } from '../../re-ducks/auth/authSlice'

type Props = {
  recipe: IRecipe
}

const DeleteRecipe: VFC<Props> = ({ recipe }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const accessToken = useAppSelector(selectUserToken)

  const onDeleteRecipeClicked = async (id: number) => {
    const resultAction = await dispatch(deleteRecipe({ id, accessToken }))
    if (deleteRecipe.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      const alertId = uuidv4()
      dispatch(
        setAlert({
          alertId,
          msg: resultAction.payload.message.message,
          alertType: 'succeeded',
        })
      )

      await router.push('/')
    } else if (deleteRecipe.rejected.match(resultAction)) {
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

  // 調理工程のorderで昇順
  const sortDescriptions = recipe.recipeDescriptions.sort((a, b) => {
    return a.order - b.order
  })

  return (
    <div>
      <Alert />
      <Grid container className={styles.recipeWrapper}>
        <Grid item xs={12}>
          <Grid container className={styles.recipeName}>
            <h1>{recipe.name}を削除しますか？</h1>
          </Grid>
          <Grid container className={styles.recipeName}>
            <Typography gutterBottom variant="h4" component="h2">
              <Box fontWeight="fontWeightBold">{recipe.name}</Box>
            </Typography>
          </Grid>
          <Grid container>
            <ul className={styles.tag}>
              {recipe.tags.map((tag) => (
                <div key={tag.id}>
                  <Typography
                    variant="body2"
                    color="primary"
                    component="p"
                    className={styles.linkText}
                  >
                    #{tag.name}
                  </Typography>
                </div>
              ))}
            </ul>
          </Grid>
          <Grid container>
            <Typography variant="body2" color="textSecondary" component="p">
              {format(new Date(recipe.createdAt), 'yyyy-MM-dd')}
            </Typography>
          </Grid>
          <Grid container className={styles.image}>
            <CardMedia
              className={styles.media}
              image={recipe.image}
              component="img"
            />
          </Grid>
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
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
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
              {sortDescriptions.map((recipeDescription) => (
                <div key={recipeDescription.id}>
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
              color="inherit"
              onClick={() => router.push('/')}
            >
              一覧へ戻る
            </Button>
            <Button
              onClick={() => onDeleteRecipeClicked(recipe.id)}
              size="small"
              color="secondary"
              type="button"
              variant="contained"
            >
              削除
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default DeleteRecipe
