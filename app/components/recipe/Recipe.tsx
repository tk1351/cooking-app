import React, { VFC, useEffect } from 'react'
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
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import {
  fetchRecipeById,
  selectRecipe,
  selectRecipeLoading,
} from '../../re-ducks/recipe/recipeSlice'

const useStyles = makeStyles({
  media: {
    maxWidth: 345,
    height: 140,
  },
})

const Recipe: VFC = () => {
  const dispatch = useAppDispatch()
  const classes = useStyles()

  const loading = useAppSelector(selectRecipeLoading)
  const recipe = useAppSelector(selectRecipe)

  const router = useRouter()
  const { recipeId } = router.query

  useEffect(() => {
    dispatch(fetchRecipeById(Number(recipeId)))
  }, [])

  return (
    <div>
      {loading ? (
        <>読み込み中</>
      ) : (
        <>
          {recipe && (
            <Card>
              <CardActionArea>
                <CardMedia className={classes.media} image={recipe.image} />
                <CardContent>
                  <Typography gutterBottom variant="h4" component="h2">
                    {recipe.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
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
                <Button size="small" color="primary">
                  ♡
                </Button>
              </CardActions>
            </Card>
          )}
        </>
      )}
      <Button onClick={() => router.push('/')}>一覧へ戻る</Button>
    </div>
  )
}

export default Recipe
