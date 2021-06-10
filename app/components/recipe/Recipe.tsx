import React, { VFC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { format } from 'date-fns'
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  makeStyles,
} from '@material-ui/core'
import Link from 'next/link'
import { unwrapResult } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import { likeRecipe, unlikeRecipe } from '../../re-ducks/recipe/recipeSlice'
import { selectUserRole, selectUserId } from '../../re-ducks/auth/authSlice'
import { IRecipe } from '../../re-ducks/recipe/type'
import { setAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import Alert from '../common/Alert'

const useStyles = makeStyles({
  media: {
    maxWidth: 345,
    height: 140,
  },
})

type Props = {
  recipe: IRecipe
}

const Recipe: VFC<Props> = ({ recipe }) => {
  const dispatch = useAppDispatch()
  const classes = useStyles()

  const userRole = useAppSelector(selectUserRole)
  const userId = useAppSelector(selectUserId)

  const [isLiked, setIsLiked] = useState(false)
  const [likedNumber, setLikedNumber] = useState(recipe.recipeLikes.length)

  console.log('fav', likedNumber)

  const router = useRouter()

  const onClick = async (name: string) => {
    router.push({
      pathname: '/tag',
      query: { name },
    })
  }

  const onLikeRecipeClicked = async (id: number) => {
    const resultAction = await dispatch(likeRecipe(id))
    if (likeRecipe.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)
      setIsLiked(true)

      const alertId = uuidv4()
      dispatch(
        setAlert({
          alertId,
          msg: resultAction.payload.message,
          alertType: 'succeeded',
        })
      )
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)
      setLikedNumber((prev) => prev + 1)
    }
  }

  const onUnlikeRecipeClicked = async (id: number) => {
    const resultAction = await dispatch(unlikeRecipe(id))
    if (unlikeRecipe.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      const alertId = uuidv4()
      dispatch(
        setAlert({
          alertId,
          msg: resultAction.payload.message,
          alertType: 'succeeded',
        })
      )
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)

      setIsLiked(false)
      setLikedNumber((prev) => prev - 1)
    }
  }

  const likeButton = (
    <Button
      size="small"
      color="primary"
      onClick={() => onLikeRecipeClicked(recipe.id)}
    >
      ○
    </Button>
  )

  const unLikeButton = (
    <Button
      size="small"
      color="primary"
      onClick={() => onUnlikeRecipeClicked(recipe.id)}
    >
      ✖️
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

  return (
    <div>
      <Card>
        <CardActionArea>
          <CardMedia className={classes.media} image={recipe.image} />
          <CardContent>
            <Typography gutterBottom variant="h4" component="h2">
              {recipe.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {format(new Date(recipe.createdAt), 'yyyy-MM-dd')}
            </Typography>
            <Typography gutterBottom variant="h6" component="h2">
              材料
            </Typography>
            {recipe.ingredients.map((ingredient) => (
              <Typography
                key={ingredient.id}
                variant="body2"
                color="textPrimary"
                component="p"
              >
                {ingredient.name}： {ingredient.amount}
              </Typography>
            ))}
            <Typography gutterBottom variant="h6" component="h2">
              調理工程
            </Typography>
            {recipe.recipeDescriptions.map((recipeDescription) => (
              <Typography
                key={recipeDescription.id}
                variant="body2"
                color="textPrimary"
                component="p"
              >
                {recipeDescription.order}： {recipeDescription.text}
              </Typography>
            ))}
            <Typography variant="body2" color="textPrimary" component="p">
              補足：{recipe.remarks}
            </Typography>
            {recipe.tags.map((tag) => (
              <Button
                key={tag.id}
                size="small"
                color="primary"
                onClick={() => onClick(tag.name)}
              >
                #{tag.name}
              </Button>
            ))}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          {userRole === 'admin' ? (
            <>
              <Button size="small" color="primary">
                <Link href={`/recipe/edit/${recipe.id}`}>編集</Link>
              </Button>
              <Button size="small" color="primary" type="button">
                <Link href={`/admin/recipe/${recipe.id}`}>削除</Link>
              </Button>
            </>
          ) : (
            <></>
          )}
          {userRole === 'user' ? (
            <>
              <ChangeLikedState />
              {likedNumber >= 1 && likedNumber}
              <Alert />
            </>
          ) : (
            <></>
          )}
        </CardActions>
      </Card>
      <Button onClick={() => router.push('/')}>一覧へ戻る</Button>
    </div>
  )
}

export default Recipe
