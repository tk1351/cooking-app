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
} from '@material-ui/core'
import { IRecipe } from '../../re-ducks/recipe/type'
import Link from 'next/link'

type Props = {
  recipe: IRecipe
}

const RecipeItem: VFC<Props> = ({ recipe }) => {
  return (
    <Card>
      <CardActionArea>
        <CardMedia image={recipe.image} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {recipe.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {format(new Date(recipe.createdAt), 'yyyy-MM-dd')}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          <Link href={`/recipe/${recipe.id}`}>詳細</Link>
        </Button>
      </CardActions>
    </Card>
  )
}

export default RecipeItem
