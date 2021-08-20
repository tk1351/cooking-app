import React from 'react'
import { NextPage } from 'next'
import { Button, Grid } from '@material-ui/core'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { IRecipe } from '../../re-ducks/recipe/type'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import { deleteRecipe } from '../../re-ducks/recipe/recipeSlice'
import { setAlert } from '../../re-ducks/alert/alertSlice'
import { MyKnownError } from '../../re-ducks/defaultType'
import { selectUserToken } from '../../re-ducks/auth/authSlice'
import { firebaseStorage } from '../../src/utils/firebase'
import Content from '../recipe/Content'
import styles from '../../styles/components/admin/deleteRecipe.module.css'

type Props = {
  recipe: IRecipe
}

const DeleteRecipe: NextPage<Props> = ({ recipe }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const accessToken = useAppSelector(selectUserToken)

  const onDeleteRecipeClicked = async (id: number) => {
    const resultAction = await dispatch(deleteRecipe({ id, accessToken }))
    if (deleteRecipe.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      // firebaseの画像を削除
      const refUrl = firebaseStorage.refFromURL(recipe.image)
      await refUrl.delete()

      dispatch(
        setAlert({
          open: true,
          msg: resultAction.payload.message.message,
          alertType: 'succeeded',
        })
      )

      await router.push('/')
    } else if (deleteRecipe.rejected.match(resultAction)) {
      const payload = resultAction.payload as MyKnownError
      dispatch(
        setAlert({
          open: true,
          msg: payload.message as string,
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
            <h1>{recipe.name}を削除しますか？</h1>
          </Grid>
          <Content recipe={recipe} />
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
