import React, { VFC } from 'react'
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
import { IRecipe } from '../../re-ducks/recipe/type'
import { useAppSelector, useAppDispatch } from '../../re-ducks/hooks'
import { selectUserRole } from '../../re-ducks/auth/authSlice'
import { deleteRecipe } from '../../re-ducks/recipe/recipeSlice'
import { useRouter } from 'next/router'

const useStyles = makeStyles({
  media: {
    maxWidth: 345,
    height: 140,
  },
})

type Props = {
  recipe: IRecipe
}

const RecipeItem: VFC<Props> = ({ recipe }) => {
  const classes = useStyles()

  const router = useRouter()

  const dispatch = useAppDispatch()
  const userRole = useAppSelector(selectUserRole)

  const onDeleteRecipeClicked = async () => {
    if (window.confirm('レシピを削除してもよろしいですか？')) {
      await dispatch(deleteRecipe(recipe.id))
    }
  }

  const onClick = async (name: string) => {
    router.push({
      pathname: '/tag',
      query: { name },
    })
  }

  return (
    <Card>
      <CardActionArea>
        <CardMedia className={classes.media} image={recipe.image} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {recipe.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {format(new Date(recipe.createdAt), 'yyyy-MM-dd')}
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
        <Button size="small" color="primary">
          <Link href={`/recipe/${recipe.id}`}>詳細</Link>
        </Button>
        {userRole === 'admin' ? (
          <>
            <Button size="small" color="primary">
              <Link href={`/recipe/edit/${recipe.id}`}>編集</Link>
            </Button>
            <Button
              onClick={onDeleteRecipeClicked}
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
      </CardActions>
    </Card>
  )
}

export default RecipeItem
