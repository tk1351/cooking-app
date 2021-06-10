import React, { VFC } from 'react'
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  CardActions,
} from '@material-ui/core'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { IRecipe } from '../../re-ducks/recipe/type'
import { useAppSelector, useAppDispatch } from '../../re-ducks/hooks'
import { selectUserRole } from '../../re-ducks/auth/authSlice'
import { deleteRecipe } from '../../re-ducks/recipe/recipeSlice'
import { setAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import Alert from '../common/Alert'
import { MyKnownError } from '../../re-ducks/defaultType'

type Props = {
  recipe: IRecipe
}

const DeleteRecipe: VFC<Props> = ({ recipe }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const userRole = useAppSelector(selectUserRole)

  const onDeleteRecipeClicked = async (id: number) => {
    const resultAction = await dispatch(deleteRecipe(id))
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
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)

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
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)
    }
  }

  const onClick = async (name: string) => {
    router.push({
      pathname: '/tag',
      query: { name },
    })
  }

  return (
    <div>
      <Alert />
      <h1>{recipe.name}を削除しますか？</h1>
      <Card>
        <CardActionArea>
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
          {userRole === 'admin' ? (
            <>
              <Button
                onClick={() => onDeleteRecipeClicked(recipe.id)}
                size="small"
                color="secondary"
                type="button"
                variant="contained"
              >
                削除
              </Button>
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

export default DeleteRecipe
