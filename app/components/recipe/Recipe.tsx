import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { Button, Grid } from '@material-ui/core'
import { Favorite, FavoriteBorder } from '@material-ui/icons'
import Link from 'next/link'
import { unwrapResult } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import { likeRecipe, unlikeRecipe } from '../../re-ducks/recipe/recipeSlice'
import {
  selectUserRole,
  selectUserId,
  selectUserToken,
} from '../../re-ducks/auth/authSlice'
import { IRecipe } from '../../re-ducks/recipe/type'
import { setAlert } from '../../re-ducks/alert/alertSlice'
import ShareField from '../common/ShareField'
import AdminOperationButton from '../common/AdminOperationButton'
import Content from './Content'
import styles from '../../styles/components/recipe/recipe.module.css'

type Props = {
  recipe: IRecipe
}

const Recipe: NextPage<Props> = ({ recipe }) => {
  const dispatch = useAppDispatch()

  const userRole = useAppSelector(selectUserRole)
  const userId = useAppSelector(selectUserId)

  const [isLiked, setIsLiked] = useState(false)
  const [likedNumber, setLikedNumber] = useState(recipe.recipeLikes.length)

  const accessToken = useAppSelector(selectUserToken)

  const onLikeRecipeClicked = async (id: number) => {
    const resultAction = await dispatch(likeRecipe({ id, accessToken }))
    if (likeRecipe.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)
      setIsLiked((prev) => !prev)

      dispatch(
        setAlert({
          open: true,
          msg: resultAction.payload.message,
          alertType: 'succeeded',
        })
      )
      setLikedNumber((prev) => prev + 1)
    }
  }

  const onUnlikeRecipeClicked = async (id: number) => {
    const resultAction = await dispatch(unlikeRecipe({ id, accessToken }))
    if (unlikeRecipe.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      dispatch(
        setAlert({
          open: true,
          msg: resultAction.payload.message,
          alertType: 'succeeded',
        })
      )

      setIsLiked((prev) => !prev)
      setLikedNumber((prev) => prev - 1)
    }
  }

  const likeButton = (
    <Button
      size="small"
      color="primary"
      onClick={() => onLikeRecipeClicked(recipe.id)}
    >
      <FavoriteBorder />
    </Button>
  )

  const unLikeButton = (
    <Button
      size="small"
      color="primary"
      onClick={() => onUnlikeRecipeClicked(recipe.id)}
    >
      <Favorite />
    </Button>
  )

  const ChangeLikedState = () => {
    if (isLiked === false) {
      return likeButton
    } else {
      return unLikeButton
    }
  }

  useEffect(() => {
    // userのuserIdがレシピのお気に入りにあるか判定
    if (
      userRole === 'user' &&
      recipe.recipeLikes.some((elm) => elm.userId === userId)
    ) {
      setIsLiked(true)
    }
  }, [])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (e: {
    currentTarget: React.SetStateAction<HTMLElement | null>
  }) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Grid container className={styles.recipeWrapper}>
      <Grid item xs={12}>
        <Content recipe={recipe} />
        <Grid container>
          <div className={styles.buttonWrapper}>
            <div className={styles.button}>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={handleClick}
              >
                Share
              </Button>
            </div>
            <ShareField
              recipe={recipe}
              anchorEl={anchorEl}
              handleClose={handleClose}
            />
            {userRole === 'admin' && <AdminOperationButton recipe={recipe} />}
            {userRole === 'user' && (
              <>
                <ChangeLikedState />
                {likedNumber >= 1 && likedNumber}
              </>
            )}
            {userRole === undefined && (
              <div className={styles.guestFavoriteWrapper}>
                <div className={styles.favorite}>
                  <Link href="/login">
                    <FavoriteBorder />
                  </Link>
                </div>
                {likedNumber >= 1 && likedNumber}
              </div>
            )}
          </div>
        </Grid>
        <Grid container className={styles.backHomeWrapper}>
          <Link href="/">
            <p className={styles.backHome}>一覧へ戻る</p>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Recipe
