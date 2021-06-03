import React, { VFC } from 'react'
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
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import { deleteRecipe } from '../../re-ducks/recipe/recipeSlice'
import { selectUserRole } from '../../re-ducks/auth/authSlice'
import { IRecipe } from '../../re-ducks/recipe/type'

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

  const router = useRouter()

  const onDeleteRecipeClicked = async (id: number) => {
    if (window.confirm('レシピを削除してもよろしいですか？')) {
      await dispatch(deleteRecipe(id))
      router.push('/')
    }
  }

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
              <Typography
                key={tag.id}
                variant="body2"
                color="textSecondary"
                component="p"
              >
                タグ： {tag.name}
              </Typography>
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
              <Button
                onClick={() => onDeleteRecipeClicked(recipe.id)}
                size="small"
                color="primary"
                type="button"
              >
                削除
              </Button>
            </>
          ) : (
            <></>
          )}
          {userRole === 'user' ? (
            <Button size="small" color="primary">
              ♡
            </Button>
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
